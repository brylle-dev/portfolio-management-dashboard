import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { asyncHandler } from "../../middleware/http";
import { listInstrumentCtrl } from "./instrument.controller";

const instrumentRouter = Router();

instrumentRouter.get("/", requireAuth, asyncHandler(listInstrumentCtrl));

export default instrumentRouter;
