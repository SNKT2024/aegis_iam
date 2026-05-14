import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";

export const restrictTo = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.roles) {
      return next(
        new AppError("You are not logged in or have no roles assigned.", 401),
      );
    }

    const hasPermission = req.user.roles.some((role) =>
      allowedRoles.includes(role),
    );
    if (!hasPermission) {
      return next(
        new AppError("You dont have permission to perform this action", 403),
      );
    }
  };
};
