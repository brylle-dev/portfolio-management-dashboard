import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { logger } from "./logger";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({
  adapter,
  log: ["query", "info", "warn", "error"],
});

process.on("beforeExit", async () => {
  await prisma.$disconnect();
  logger.info("Disconnected from the db");
});

export { prisma };
