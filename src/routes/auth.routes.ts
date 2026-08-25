import express from "express";
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

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post("/register", validateData(userRegistrationSchema), register);

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: Authenticate user & get tokens
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post("/login", validateData(userLoginSchema), login);

/**
 * @openapi
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Refresh access token using cookie or refresh header
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid or expired refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post("/refresh", refresh);

/**
 * @openapi
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout current user session
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post("/logout", protect, logout);

/**
 * @openapi
 * /api/v1/auth/logout-all:
 *   post:
 *     summary: Logout all sessions and invalidate tokens
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All active sessions terminated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post("/logout-all", protect, blacklistToken, logoutAll);

/**
 * @openapi
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Send password reset email link
 *     tags:
 *       - Password Management
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordInput'
 *     responses:
 *       200:
 *         description: Password reset email sent if account exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */
authRouter.post("/forgot-password", forgotPassword);

/**
 * @openapi
 * /api/v1/auth/reset-password/{token}:
 *   patch:
 *     summary: Reset password with validation token
 *     tags:
 *       - Password Management
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token received via email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordInput'
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.patch("/reset-password/:token", blacklistToken, resetPassword);

export default authRouter;
