import prisma from "../config/db";
import { AppError } from "../utils/appError";
import { createHash, randomBytes } from "node:crypto";
export async function generatePasswordResetToken(email: string) {
  // Find the user

  const findUser = await prisma.user.findUnique({ where: { email: email } });
  if (!findUser) {
    return null;
  }

  // Genrate raw random bytes
  const rawToken = randomBytes(32).toString("hex");

  // Generate hash of raw token
  const passwordResetHashToken = createHash("sha256")
    .update(rawToken)
    .digest("hex");

  // Date expirt for token
  const expiryDate = new Date(Date.now() + 10 * 60 * 1000);

  // Add to database
  await prisma.user.update({
    where: { id: findUser.id },
    data: {
      resetTokenHash: passwordResetHashToken,
      resetTokenExpiry: expiryDate,
    },
  });

  return rawToken;
}
