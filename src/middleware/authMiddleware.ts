import type { NextFunction, Response } from "express";
import type { UserObject } from "../types/express";
import { AppError } from "../utils/appError";
import jwt from "jsonwebtoken";
import prisma from "../config/db";
import { isTokenBlacklisted } from "../utils/tokenBlacklist";

export async function protect(
  req: UserObject,
  res: Response,
  next: NextFunction,
) {
  try {
    // Extract the token
    const authHeader = req.headers.authorization || "";
    if (!authHeader) {
      return next(new AppError("Unauthorized Access", 401));
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(new AppError("Unauthorized Access", 401));
    }

    const isRevoked = await isTokenBlacklisted(token);
    if (!isRevoked) {
      return next(new AppError("Token expired", 401));
    }

    // verify token
    const accessSecret = process.env.JWT_ACCESS_SECRET;
    if (!accessSecret) {
      return next(new AppError("JWT_ACCESS_SECRET is not configured", 501));
    }

    let verifyToken: jwt.JwtPayload;
    try {
      verifyToken = jwt.verify(token, accessSecret) as jwt.JwtPayload;
    } catch (verifyError) {
      console.error("Token verification failed:", verifyError);
      return next(new AppError("Invalid or expired token", 401));
    }

    const userId = verifyToken.userId;

    if (!userId || typeof userId !== "string") {
      return next(new AppError("Invalid token payload", 401));
    }

    // Database check for user
    const findUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { roles: { include: { role: true } } },
    });

    if (!findUser) {
      return next(new AppError("User not found", 401));
    }

    if (findUser.deletedAt != null) {
      return next(new AppError("This account has been deactivated.", 401));
    }
    if (!findUser.email) {
      return next(new AppError("User email not set", 401));
    }

    const user = {
      userId: findUser.id,
      email: findUser.email,
      roles: findUser.roles
        ?.map((r) => r.role?.name)
        .filter(Boolean) as string[],
    };

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
