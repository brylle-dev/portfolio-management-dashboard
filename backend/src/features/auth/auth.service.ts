import { prisma } from "../../lib/db";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { add } from "date-fns";
import { env } from "../../config/env";

import { signAccessToken } from "../../middleware/auth";
import { CONFLICT } from "../../constants/http";
import { parseDuration } from "../../utils/date";
import { Prisma } from "@prisma/client";

const SALT_ROUNDS = parseInt(env.BCRYPT_SALT_ROUNDS, 10);

export const registerUser = async ({
  username,
  email,
  password,
  firstName,
  lastName,
}: {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  try {
    return await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        first_name: firstName,
        last_name: lastName,
      },
      select: {
        id: true,
        username: true,
        email: true,
        first_name: true,
        last_name: true,
        createdAt: true,
      },
    });
  } catch (error: any) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const target = error.meta?.target as string[] | undefined;
      const field = target?.[0] ?? "field";

      throw Object.assign(new Error(`${field} already in use`), {
        statusCode: CONFLICT,
      });
    }

    throw error;
  }
};

/**
 * Verify user credentials
 */

export const verifyCredentials = async (
  identifier: string,
  password: string
) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
    },
  });

  if (!user) {
    return null;
  }

  const passwordOk = await bcrypt.compare(password, user.password);
  if (!passwordOk) {
    return null;
  }

  return user;
};

/**
 * Generate random refresh token
 */

export const generateRefreshToken = async (): Promise<string> => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Persist refresh token in the DB
 */
export const persistRefreshToken = async (userId: string, rawToken: string) => {
  const tokenHash = await bcrypt.hash(rawToken, SALT_ROUNDS);
  const duration = parseDuration(env.JWT_REFRESH_EXPIRES_IN);
  const expiresAt = add(new Date(), { [duration.unit]: duration.amount });
  return prisma.refreshToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
    select: {
      id: true,
      expiresAt: true,
    },
  });
};

/**
 * Revoke refresh token by raw value
 */
export const revokeRefreshTokenByRaw = async (
  rawToken: string,
  userId?: string
) => {
  if (!userId) return false;
  const tokens = await prisma.refreshToken.findMany({
    where: { userId, revokedAt: null },
  });
  for (const token of tokens) {
    const match = await bcrypt.compare(rawToken, token.tokenHash);
    if (match) {
      await prisma.refreshToken.update({
        where: { id: token.id },
        data: { revokedAt: new Date() },
      });

      return true;
    }
  }
  return false;
};

/**
 * Rotate refresh token: revoke old, create new
 */
export const rotateRefreshToken = async (
  oldRawToken: string,
  userId: string
) => {
  await revokeRefreshTokenByRaw(oldRawToken, userId);
  const newRawToken = await generateRefreshToken();
  await persistRefreshToken(userId, newRawToken);
  return newRawToken;
};

/**
 * Issue JWT access token.
 */
export const issueAccessToken = async (userId: string) => {
  return signAccessToken({ sub: userId });
};
