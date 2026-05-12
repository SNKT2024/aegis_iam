import type { NextFunction, Request, Response } from "express";
import type { UserObject } from "../types/express";

export async function getMe(
  req: UserObject,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = req.user;
    return res.status(200).json({ message: "User object works", user });
  } catch (error) {
    next(error);
  }
}
