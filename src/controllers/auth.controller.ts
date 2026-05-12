import type { NextFunction, Request, Response } from "express";
import { registerUser } from "../services/registerUser";
import { userLogin } from "../services/loginUser";
import { sendTokenResponse } from "../utils/sendTokens";
import { AppError } from "../utils/appError";
import jwt from "jsonwebtoken";
import { createHash } from "node:crypto";
import prisma from "../config/db";
import { refreshSession } from "../services/refreshSession";

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

    sendTokenResponse(result, 201, res);
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    // Extract credentials

    const { email, password } = req.body;

    // Calling login service
    const result = await userLogin(email, password);

    sendTokenResponse(result, 200, res);
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  // Extract Refresh Token
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return next(new AppError("Unauthorized Access", 401));
  }

  const user = await refreshSession(refreshToken);
  // Re Issuance
  sendTokenResponse(user, 200, res);
}
