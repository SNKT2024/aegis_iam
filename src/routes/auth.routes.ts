import express, { type Request, type Response } from "express";
import {
  forgotPassword,
  login,
  logout,
  logoutAll,
  refresh,
  register,
  resetPassword,
} from "../controllers/auth.controller";
import { validateData } from "../middleware/validationMiddleware";
import {
  userLoginSchema,
  userRegistrationSchema,
} from "../schemas/userSchemas";
import { protect } from "../middleware/authMiddleware";
import { blacklistToken } from "../utils/tokenBlacklist";

const authRouter = express.Router();

// Register Route
authRouter.post("/register", validateData(userRegistrationSchema), register);

// login Route
authRouter.post("/login", validateData(userLoginSchema), login);

//Refresh Route
authRouter.post("/refresh", refresh);

// logout Route
authRouter.post("/logout", protect, logout);

// logout all devices
authRouter.post("/logout-all", protect, blacklistToken, logoutAll);

// Reset password
authRouter.post("/forgot-password", forgotPassword);

// Update new password
authRouter.patch("/reset-password/:token", blacklistToken, resetPassword);
export default authRouter;
