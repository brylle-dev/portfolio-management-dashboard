import { Router } from "express";
import { authRateLimiter } from "../../middleware/rateLimit";
import { asyncHandler, validate } from "../../middleware/http";
import { registerSchema, loginSchema } from "./auth.types";
import { register, login, me, refresh, logout } from "./auth.controller";
import { requireAuth } from "../../middleware/auth";

const router = Router();

router.post(
  "/register",
  authRateLimiter,
  validate(registerSchema),
  asyncHandler(register)
);
router.post(
  "/login",
  authRateLimiter,
  validate(loginSchema),
  asyncHandler(login)
);
router.post("/refresh", asyncHandler(refresh));
router.post("/logout", requireAuth, asyncHandler(logout));
router.get("/me", requireAuth, asyncHandler(me));

export default router;
