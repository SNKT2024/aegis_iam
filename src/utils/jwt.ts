import type { JwtPayload, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";

// interface for strict payload structure
interface TokenPayload {
  userId: string;
  roles: string[];
}

const accessSecret = process.env.JWT_ACCESS_SECRET as string;
const refreshSecret = process.env.JWT_REFRESH_SECRET as string;

// verfying secrets even before server runs
if (!accessSecret || !refreshSecret) {
  throw new Error("JWT secrets are not defined in .env");
}

// generate access token
export const generateAccessToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_ACCESS_EXPIRY || "15m") as any,
  };
  const token = jwt.sign(payload, accessSecret!, options);
  return token;
};

// generate refresh token
export const generateRefreshToken = (payload: TokenPayload) => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_REFRESH_EXPIRY || "7d") as any,
  };
  const token = jwt.sign(payload, refreshSecret!, options);
  return token;
};
