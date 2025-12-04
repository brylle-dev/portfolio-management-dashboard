import dotenv from "dotenv";
import { execSync } from "node:child_process";

export default async () => {
  dotenv.config({ path: ".env.test" });

  // Ensure prisma client is generated
  execSync("npx prisma generate", { stdio: "inherit" });
  // Apply all migrations to the test DB
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
  // reset to empty every run
  // execSync("npx prisma migrate reset --force", { stdio: "inherit" });
};
