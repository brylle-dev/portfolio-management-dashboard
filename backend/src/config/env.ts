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

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: parseInt(process.env.PORT ?? "3000", 10),
  DATABASE_URL: requiredEnvVars("DATABASE_URL"),
  JWT_SECRET: requiredEnvVars("JWT_SECRET"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "15m",
};
