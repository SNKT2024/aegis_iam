import jwt from "jsonwebtoken";
import type { JwtPayload, SignOptions } from "jsonwebtoken";
import { AppError } from "./appError";
import { redisClient } from "../config/redis";

export async function blacklistToken(token: string): Promise<void> {
  // Decode the token to get payload
  const payload = jwt.decode(token) as jwt.JwtPayload;
  // get expiry from payload
  const expiry = payload.exp;
  if (expiry === undefined) {
    throw new AppError("Token does not have an expiration time", 400);
  }

  // calculate remaning time
  const timeLeft = Math.ceil((expiry ?? 0) - Date.now() / 1000);

  if (timeLeft <= 0) {
    return;
  }

  redisClient.set(token, "blacklisted", { EX: timeLeft });
}

export async function isTokenBlacklisted(token: string): Promise<boolean> {
  const tokenCheck = await redisClient.get(token);

  return !!tokenCheck;
}
