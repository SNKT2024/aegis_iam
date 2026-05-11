import type { NextFunction, Response } from "express";
import type { UserObject } from "../types/express";
import { AppError } from "../utils/appError";
import jwt from "jsonwebtoken";
import prisma from "../config/db";

export async function protect(
  req: UserObject,
  res: Response,
  next: NextFunction,
) {
  try {
    // Extract the token
    const authHeader = req.headers.authorization || "";
    if (!authHeader) {
      return res.status(401).json({ error: "Unauthorized Access" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized Access" });
    }

    // verify token
    const accessSecret = process.env.JWT_ACCESS_SECRET;
    if (!accessSecret) {
      return res
        .status(500)
        .json({ error: "JWT_ACCESS_SECRET is not configured" });
    }

    const payload = jwt.verify(token, accessSecret) as
      | jwt.JwtPayload
      | { userId?: string; sub?: string; id?: string; email?: string };

    // accept common claim names: `userId`, `sub`, or `id`
    const userId = (payload &&
      ((payload as any).userId ||
        (payload as any).sub ||
        (payload as any).id)) as string | undefined;

    if (!userId || typeof userId !== "string") {
      return res.status(401).json({ error: "Invalid token payload" });
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
