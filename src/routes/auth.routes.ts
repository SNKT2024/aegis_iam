import express, { type Request, type Response } from "express";
import { login, register } from "../controllers/auth.controller";
import { validateData } from "../middleware/validationMiddleware";
import {
  userLoginSchema,
  userRegistrationSchema,
} from "../schemas/userSchemas";

const authRouter = express.Router();

// Register Route
authRouter.post("/register", validateData(userRegistrationSchema), register);

// login Route
authRouter.post("/login", validateData(userLoginSchema), login);

export default authRouter;
