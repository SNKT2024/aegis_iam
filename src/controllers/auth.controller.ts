import type { NextFunction, Request, Response } from "express";
import { registerUser } from "../services/registerUser";
import { AppError } from "../utils/appError";

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
    res.status(201).json({ message: "User registerd successfully!", result });
  } catch (error) {
    next(error);
  }
}
