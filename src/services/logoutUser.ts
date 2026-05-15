import { createHash } from "node:crypto";
import prisma from "../config/db";

export async function userLogout(refreshToken: string) {
  // Hash the token
  const tokenHash = createHash("sha256").update(refreshToken).digest("hex");

  // Delete specific token
  await prisma.refreshToken.deleteMany({
    where: { tokenHash },
  });
}

export async function userAllLogout(userId: string) {
  // Delete all refresh token for the recieved user userId
  await prisma.refreshToken.deleteMany({ where: { userId: userId } });
}
