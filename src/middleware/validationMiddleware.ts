import type { NextFunction, Request, Response } from "express";
import type z from "zod";
import { ZodError } from "zod";
import { AppError } from "../utils/appError";

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        const errorMessage = formattedErrors.map((e) => e.message).join(", ");
        return next(new AppError(errorMessage, 400));
      }

      next(error);
    }
  };
}
