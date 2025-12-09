import http from "http";
import app from "./app";
import { env } from "process";

const server = http.createServer(app);

server.listen(env.PORT || 3000, () => {
  console.log(`Server is running on http://localhost:${env.PORT || 3000}`);
});

const shutdown = (signal: string) => {
  console.log(`Received ${signal}. Shutting down server...`);
  server.close((err) => {
    if (err) {
      console.error("Error during server shutdown:", err);
      process.exit(1);
    }
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
