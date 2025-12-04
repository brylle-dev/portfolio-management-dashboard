import request from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/lib/db";
import { truncateAll } from "../helpers/db";
import { describe, beforeAll, afterAll, it, expect } from "@jest/globals";

describe("Auth routes", () => {
  const base = "/api/v1/auth";

  beforeAll(async () => {
    await truncateAll();
  });

  afterAll(async () => {
    await truncateAll();
    await prisma.$disconnect();
  });

  it("register user", async () => {
    const res = await request(app)
      .post(`${base}/register`)
      .send({
        username: "newUser",
        email: "newUser@example.com",
        password: "P@ssw0rd123!",
        firstName: "Some",
        lastName: "User",
      })
      .expect(201);

    expect(res.body.user).toMatchObject({
      email: "newUser@example.com",
      username: "newUser",
      firstName: "Some",
    });
  });

  it("logs in using username and hits /me", async () => {
    await request(app).post(`${base}/register`).send({
      username: "loginUser",
      email: "loginUser@example.com",
      password: "P@ssw0rd123!",
      firstName: "Login User",
      lastName: "Test",
    });

    const login = await request(app)
      .post(`${base}/login`)
      .send({
        identifier: "loginUser",
        password: "P@ssw0rd123!",
      })
      .expect(200);

    const token = login.body.access_token;
    const me = await request(app)
      .get(`${base}/me`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(me.body.user.sub).toBeDefined();
  });
});
