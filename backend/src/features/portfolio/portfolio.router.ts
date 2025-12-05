import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { listPortfoliosCtrl } from "./portfolio.controller";
import { asyncHandler } from "../../middleware/http";

const portfolioRouter = Router();

portfolioRouter.get("/", requireAuth, asyncHandler(listPortfoliosCtrl));

export default portfolioRouter;
