import express from "express";
import type { Application, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { AppError } from "./utils/appError";
import { globalErrorHandler } from "./middleware/errorMiddleware";
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import { connectRedis } from "./config/redis";

await connectRedis();
const app: Application = express();

// Essential security and utility middleware
app.use(helmet()); // sets securtiy releated HTTP headers
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http:localhost:3000", // for frontend
    credentials: true, //for sending recieveing cookies
  }),
);
app.use(morgan("dev")); //logs request to console
app.use(express.json()); // json parser for payload
app.use(cookieParser()); // parser for cookies for refresh tokens
// Test Route to trigger an error
app.get("/error-test", (req, res, next) => {
  next(new AppError("This is a custom error test!", 400));
});

// App health check route
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "UP", message: "Aegis IAM is running" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

// 404 Route - Catch all undefined routes
app.all("/*path", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;
