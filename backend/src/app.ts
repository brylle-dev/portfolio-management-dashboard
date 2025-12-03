import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import pino from "pino";
import pinoHttp from "pino-http";

import { env } from "./config/env";

import healthRouter from "./routes/health";

const app = express();

// Logging
const logger = pino({
  level: env.NODE_ENV === "development" ? "debug" : "info",
});
app.use(pinoHttp({ logger }));

// Security headers
app.use(helmet());

// CORS
app.use(cors());

// Gzip compression
app.use(compression());

// Body parsers
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Cookie parser
app.use(cookieParser());

//Routers
app.use("/api/health", healthRouter);

export default app;
