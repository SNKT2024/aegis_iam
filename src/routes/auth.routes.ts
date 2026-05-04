import express, { type Request, type Response } from "express";
import { register } from "../controllers/auth.controller";
import { validateData } from "../middleware/validationMiddleware";
import { userRegistrationSchema } from "../schemas/userSchemas";

const authRouter = express.Router();

// Register Route
authRouter.post("/register", validateData(userRegistrationSchema), register);
export default authRouter;
