import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import {
  createPortfolioCtrl,
  listPortfoliosCtrl,
  overviewPortfolioCtrl,
} from "./portfolio.controller";
import { asyncHandler, validate } from "../../middleware/http";
import { createPortfolioSchema } from "./portfolio.types";

const portfolioRouter = Router();

portfolioRouter.get("/", requireAuth, asyncHandler(listPortfoliosCtrl));
portfolioRouter.post(
  "/",
  requireAuth,
  validate(createPortfolioSchema),
  asyncHandler(createPortfolioCtrl)
);

portfolioRouter.get(
  "/:id/overview",
  requireAuth,
  asyncHandler(overviewPortfolioCtrl)
);

export default portfolioRouter;
