import express, { type Request, type Response } from "express";
import {
  login,
  logout,
  logoutAll,
  refresh,
  register,
} from "../controllers/auth.controller";
import { validateData } from "../middleware/validationMiddleware";
import {
  userLoginSchema,
  userRegistrationSchema,
} from "../schemas/userSchemas";
import { protect } from "../middleware/authMiddleware";

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
authRouter.post("/logout-all", protect, logoutAll);
export default authRouter;
