import express from "express";
import type { Application, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

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

// Server health check route
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "UP", message: "Aegis IAM is running" });
});

export default app;
