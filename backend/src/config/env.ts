import dotenv from "dotenv";
import { parse } from "path";
dotenv.config();

const requiredEnvVars = (name: string) => {
  const envVar = process.env[name];
  if (!envVar) {
    throw new Error(`Missing required variable ${name}`);
  }
  return envVar;
};

interface Env {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;
  CORS_ORIGIN: string[];
  COOKIE_DOMAIN: string;
  BCRYPT_SALT_ROUNDS: string;
}

export const env: Env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: parseInt(process.env.PORT ?? "3000", 10),
  DATABASE_URL: requiredEnvVars("DATABASE_URL"),
  JWT_SECRET: requiredEnvVars("JWT_SECRET"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",

  CORS_ORIGIN: (process.env.CORS_ORIGIN ?? "")
    .split(",")
    .map((orig) => orig.trim())
    .filter(Boolean),

  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN ?? "localhost",
  BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS ?? "12",
};
