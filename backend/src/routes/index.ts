import { Router } from "express";
import healthRouter from "../features/health/health.router";
import authRouter from "../features/auth/auth.router";
import userRouter from "../features/user/user.router";
import portfolioRouter from "../features/portfolio/portfolio.router";
import instrumentRouter from "../features/instrument/instrument.router";
import transactionRouter from "../features/transaction/transaction.router";

const v1 = Router();

v1.use("/health", healthRouter);
v1.use("/auth", authRouter);
v1.use("/user", userRouter);
v1.use("/portfolio", portfolioRouter);
v1.use("/instrument", instrumentRouter);
v1.use("/transaction", transactionRouter);

export const apiRouter = Router();
apiRouter.use("/v1", v1);
