import type { Response } from "express";
import { generateAccessToken, generateRefreshToken } from "./jwt";

interface userObject {
  userId: string;
  email: string;
  roles: string[];
}

export const sendTokenResponse = (
  userObj: userObject,
  statusCode: number,
  res: Response,
) => {
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

  // Set cookie

  res.cookie("refreshToken", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
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
};
