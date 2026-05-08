import type { NextFunction, Request, Response } from "express";
import { registerUser } from "../services/registerUser";
import { userLogin } from "../services/loginUser";
import { sendTokenResponse } from "../utils/sendTokens";

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
