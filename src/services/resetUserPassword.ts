import { createHash } from "node:crypto";
import prisma from "../config/db";
import { AppError } from "../utils/appError";
import bcrypt from "bcrypt";
import { userAllLogout } from "./logoutUser";

export async function resetUserPassword(rawToken: string, newPassword: string) {
  // Hash incoming raw token
  const tokenHash = createHash("sha256").update(rawToken).digest("hex");

  // Find user based on hash
  const findUser = await prisma.user.findUnique({
    where: { resetTokenHash: tokenHash },
  });

  if (!findUser) {
    throw new AppError("Token is invalid or expired", 400);
  }

  // Compare the token expiry with current time
  const expiry = findUser.resetTokenExpiry;
  if (!expiry) {
    throw new AppError("Invalid expiry", 400);
  }
  const currentDate = new Date(Date.now());
  const isExpired = expiry < currentDate;

  if (isExpired) {
    throw new AppError("Token is invalid or expired", 400);
  }

  // Hashing the new password
  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(newPassword, salt);

  // Revoking all other sessions or other devices
  await userAllLogout(findUser.id);
  // Nulling the credentials & Updating User in DB with new Password hash

  const updateUser = await prisma.user.update({
    where: { id: findUser.id },
    data: {
      passwordHash: hashPassword,
      resetTokenHash: null,
      resetTokenExpiry: null,
    },
  });

  if (!updateUser) {
    throw new AppError("Database query failed", 400);
  }

  return true;
}
