import type { NextFunction, Response } from "express";
import type { UserObject } from "../types/express";
import { AppError } from "../utils/appError";

export function protect(req: UserObject, res: Response, next: NextFunction) {
  // Extract the token

  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    console.log("Token Recieved", token);
  } else {
    throw new AppError("Token not found", 401);
  }
}
