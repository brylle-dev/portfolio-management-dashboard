import { Router } from "express";
import { OK } from "../../constants/http.js";

const router = Router();

router.get("/", (_req, res) => {
  res.status(OK).json({ status: "ok", time: new Date().toISOString() });
});

export default router;
