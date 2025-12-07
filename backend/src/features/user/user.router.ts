import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { asyncHandler } from "../../middleware/http";
import { meCtrl } from "./user.controller";

const userRouter = Router();

userRouter.get("/me", requireAuth, asyncHandler(meCtrl));

export default userRouter;
