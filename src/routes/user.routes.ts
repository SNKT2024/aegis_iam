// test Route
import { getMe } from "../controllers/user.controller";
import { protect } from "../middleware/authMiddleware";
import express, { type Request, type Response } from "express";

const userRouter = express.Router();
userRouter.get("/me", protect, getMe);

export default userRouter;
