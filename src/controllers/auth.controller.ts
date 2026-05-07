import type { NextFunction, Request, Response } from "express";
import { registerUser } from "../services/registerUser";
import { AppError } from "../utils/appError";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // Extract input from request body
    const { email, password } = req.body;

    // Calling Service to register user
    const result = await registerUser(email, password);

    //Token Generation

    // access
    const accessToken = generateAccessToken({
      userId: result.userId,
      role: result.role,
    });

    // Referesh
    const refreshToken = generateRefreshToken({
      userId: result.userId,
      role: result.role,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.status(201).json({
      message: "User registerd successfully!",
      result: {
        email: result.email,
        role: result.role,
      },
      accessToken: accessToken,
    });
  } catch (error) {
    next(error);
  }
}
