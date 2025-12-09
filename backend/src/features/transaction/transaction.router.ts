import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { asyncHandler, validate } from "../../middleware/http";
import { createTxnCtrl, listTxnCtrl } from "./transaction.controller";
import { createTxnSchema } from "./transaction.types";

const transactionRouter = Router();

transactionRouter.get("/:portfolioId", requireAuth, asyncHandler(listTxnCtrl));
transactionRouter.post(
  "/",
  requireAuth,
  validate(createTxnSchema),
  asyncHandler(createTxnCtrl)
);

export default transactionRouter;
