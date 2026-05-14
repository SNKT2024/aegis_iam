// test Route
import { getMe } from "../controllers/user.controller";
import { protect } from "../middleware/authMiddleware";
import express, { type Request, type Response } from "express";
import { restrictTo } from "../middleware/roleMiddleware";

const userRouter = express.Router();
userRouter.get("/me", protect, getMe);

userRouter.get("/admin/users", protect, restrictTo("admin"), getMe);
export default userRouter;
