import { prisma } from "../../../lib/db";
import { truncateAll } from "../../../../tests/helpers/db";
import { registerUser, verifyCredentials } from "../auth.service";
import { CONFLICT } from "../../../constants/http";

import { describe, beforeAll, afterAll, it, expect } from "@jest/globals";

describe("auth.service", () => {
  beforeAll(async () => {
    await truncateAll();
  });
  afterAll(async () => {
    await truncateAll();
    await prisma.$disconnect();
  });

  it("creates user and enforces unique email/username", async () => {
    const testUser = await registerUser({
      email: "user1@example.com",
      username: "user1",
      password: "P@ssw0rd123!",
      firstName: "Test",
      lastName: "User",
    });

    expect(testUser.email).toBe("user1@example.com");

    await expect(
      registerUser({
        email: "user1@example.com",
        username: "user2",
        password: "P@ssw0rd123!",
        firstName: "Test2",
        lastName: "User2",
      })
    ).rejects.toHaveProperty("statusCode", CONFLICT);

    await expect(
      registerUser({
        email: "user2@example.com",
        username: "user1",
        password: "P@ssw0rd123!",
        firstName: "Test2",
        lastName: "User2",
      })
    ).rejects.toHaveProperty("statusCode", CONFLICT);
  });

  it("verifies by email/username", async () => {
    await registerUser({
      email: "login@example.com",
      username: "loginuser",
      password: "P@ssw0rd123!",
      firstName: "LoginUser",
      lastName: "Test",
    });

    const byEmail = await verifyCredentials(
      "login@example.com",
      "P@ssw0rd123!"
    );
    expect(byEmail?.email).toBe("login@example.com");

    const byUsername = await verifyCredentials("loginuser", "P@ssw0rd123!");
    expect(byUsername?.username).toBe("loginuser");

    const badRequest = await verifyCredentials(
      "loginUser@example.com",
      "WrongPass"
    );
    expect(badRequest).toBeNull();
  });
});
