import type { NextFunction, Request, Response } from "express";
import { registerUser } from "../services/registerUser";
import { userLogin } from "../services/loginUser";
import { sendTokenResponse } from "../utils/sendTokens";
import { AppError } from "../utils/appError";
import { refreshSession } from "../services/refreshSession";
import { userAllLogout, userLogout } from "../services/logoutUser";
import { generatePasswordResetToken } from "../services/resetPassword";

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

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    // Extract refresh token from cookie
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await userLogout(refreshToken);
    }

    // Clear the cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
}

export async function logoutAll(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return next(new AppError("User not found", 404));
    }

    await userAllLogout(userId);

    // Clear the cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // Extract email
    const { email } = req.body;
    if (!email) {
      return next(new AppError("Invalid credentials", 400));
    }

    // Genrate raw token
    const rawToken = await generatePasswordResetToken(email);

    const resetLink = `https://yourapp.com/reset-password?token=${rawToken}`;

    res.status(200).json({
      message:
        "If an account with that email exists a reset link will be sent.",
      resetLink,
    });
  } catch (error) {
    next(error);
  }
}
