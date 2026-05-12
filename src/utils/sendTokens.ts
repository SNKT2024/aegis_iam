import type { Response } from "express";
import { generateAccessToken, generateRefreshToken } from "./jwt";
import { createHash } from "node:crypto";
import prisma from "../config/db";
import { parseExpiryToMs } from "./time";
interface userObject {
  userId: string;
  email: string;
  roles: string[];
}

export async function sendTokenResponse(
  userObj: userObject,
  statusCode: number,
  res: Response,
) {
  //Token Generation

  // access
  const accessToken = generateAccessToken({
    userId: userObj.userId,
    roles: userObj.roles,
  });

  // Referesh
  const refreshToken = generateRefreshToken({
    userId: userObj.userId,
    roles: userObj.roles,
  });

  // Save refresh token in db
  const refreshExpiryStr = process.env.JWT_REFRESH_EXPIRY || "7d";
  const expiryMs = parseExpiryToMs(refreshExpiryStr);
  const expiryDate = new Date(Date.now() + expiryMs);
  const tokenHash = createHash("sha256").update(refreshToken).digest("hex");

  await prisma.refreshToken.create({
    data: {
      userId: userObj.userId,
      tokenHash: tokenHash,
      expiresAt: expiryDate,
    },
  });

  // Set cookie
  res.cookie("refreshToken", refreshToken, {
    maxAge: expiryMs,
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.status(statusCode).json({
    message: `User ${statusCode === 201 ? "registerd" : statusCode === 200 ? "loggedin" : "auth"} successfully!`,
    result: {
      email: userObj.email,
      role: userObj.roles,
    },
    accessToken: accessToken,
  });
}
