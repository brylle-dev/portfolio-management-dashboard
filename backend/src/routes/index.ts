import { Router } from "express";
import healthRouter from "../features/health/health.router";
import authRouter from "../features/auth/auth.router";

const v1 = Router();

v1.use("/health", healthRouter);
v1.use("/auth", authRouter);

export const apiRouter = Router();
apiRouter.use("/v1", v1);
