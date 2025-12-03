import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { RegisterDTO, LoginDTO } from "./auth.schema";
import {
  registerUser,
  verifyCredentials,
  generateRefreshToken,
  persistRefreshToken,
  issueAccessToken,
  rotateRefreshToken,
  revokeRefreshTokenByRaw,
} from "./auth.service";

import { env } from "../../config/env";
import { msFromDuration } from "../../utils/date";
import { BAD_REQUEST, CREATED, OK, UNAUTHORIZED } from "../../constants/http";
import { logger } from "../../lib/logger";

const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie("refresh_token", token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    domain: env.COOKIE_DOMAIN,
    path: "/api/v1/auth",
    maxAge: msFromDuration(env.JWT_REFRESH_EXPIRES_IN),
  });
};

const clearRefreshTokenCookie = (res: Response) => {
  res.cookie("refresh_token", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    domain: env.COOKIE_DOMAIN,
    path: "/api/v1/auth",
  });
};

/**
 * Register a new user
 * @param req
 * @param res
 */
export const register = async (req: Request, res: Response) => {
  const { username, email, password, firstName, lastName } = (req as any)
    .validated as RegisterDTO;
  const user = await registerUser({
    username,
    email,
    password,
    firstName,
    lastName,
  });
  res.status(CREATED).json({
    message: "User registered successfully",
    user: { id: user.id, username: user.username, email: user.email },
  });
};
/**
 * Login user
 *
 */
export const login = async (req: Request, res: Response) => {
  const { identifier, password } = (req as any).validated as LoginDTO;
  const user = await verifyCredentials(identifier, password);
  if (!user) {
    return res.status(UNAUTHORIZED).json({ message: "Invalid credentials" });
  }
  const accessToken = await issueAccessToken(user.id);
  console.log("ISSUED ACCESS TOKEN", accessToken);
  const rawRefreshToken = await generateRefreshToken();
  await persistRefreshToken(user.id, rawRefreshToken);
  setRefreshTokenCookie(res, rawRefreshToken);
  return res.status(OK).json({
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: env.JWT_EXPIRES_IN,
  });
};

/**
 * ME
 */
export const me = async (req: Request, res: Response) => {
  return res.status(OK).json({ user: (req as any).user });
};

/** Refresh  */
export const refresh = async (req: Request, res: Response) => {
  const refreshRawToken = req.cookies["refresh_token"];
  if (!refreshRawToken) {
    return res.status(UNAUTHORIZED).json({ message: "Not authenticated" });
  }

  const access = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice("Bearer ".length)
    : undefined;

  let userId: string | undefined;
  if (access) {
    try {
      const payload = jwt.verify(access, env.JWT_SECRET) as JwtPayload;
      userId = payload.sub;
    } catch (error) {
      // ignore error
    }
  }

  if (!userId) {
    return res
      .status(BAD_REQUEST)
      .json({ message: "Missing user context for refresh" });
  }

  const newRefreshTokenRaw = await rotateRefreshToken(refreshRawToken, userId);
  const newAccessToken = await issueAccessToken(userId);
  setRefreshTokenCookie(res, newRefreshTokenRaw);
  return res.status(OK).json({
    access_token: newAccessToken,
    token_type: "Bearer",
    expires_in: env.JWT_EXPIRES_IN,
  });
};

/** Logout user */
export const logout = async (req: Request, res: Response) => {
  const refreshRawToken = req.cookies["refresh_token"];
  const user = (req as any).user as JwtPayload | undefined;

  if (refreshRawToken && user?.sub) {
    await revokeRefreshTokenByRaw(refreshRawToken, user.sub);
  }
  clearRefreshTokenCookie(res);
  return res.status(204).send();
};
