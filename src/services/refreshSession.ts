import { createHash } from "node:crypto";
import { AppError } from "../utils/appError";
import jwt from "jsonwebtoken";
import prisma from "../config/db";

export async function refreshSession(token: string) {
  // Verify Token
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  if (!refreshSecret) {
    throw new AppError("JWT_REFRESH_SECRET is not configured", 501);
  }
  let verifyToken: jwt.JwtPayload;
  try {
    verifyToken = jwt.verify(token, refreshSecret) as jwt.JwtPayload;
  } catch (verifyError) {
    console.error("Token verification failed:", verifyError);
    throw new AppError("Invalid or expired token", 401);
  }

  // Hashing the incoming token
  const hash = createHash("sha256").update(token).digest("hex");

  // Finding the hash in DB and compare
  const compareHash = await prisma.refreshToken.findUnique({
    where: {
      tokenHash: hash,
    },
  });

  if (!compareHash) {
    throw new AppError("Unauthorized Access", 401);
  }

  // Delete old token
  await prisma.refreshToken.delete({ where: { tokenHash: hash } });

  // fetch user from db
  const findUser = await prisma.user.findUnique({
    where: { id: verifyToken.userId },
    include: { roles: { include: { role: true } } },
  });
  if (!findUser) {
    throw new AppError("User not exsist", 404);
  }
  if (findUser.deletedAt != null) {
    throw new AppError("This account has been deactivated.", 401);
  }

  const user = {
    userId: findUser.id,
    email: findUser.email,
    roles: findUser.roles?.map((r) => r.role?.name).filter(Boolean) as string[],
  };

  return user;
}
