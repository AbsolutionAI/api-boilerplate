import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import { startTestServer, json } from "./helpers.js";

let srv;
before(async () => { srv = await startTestServer(); });
after(async () => { await srv.close(); });

describe("Health endpoint", () => {
  it("returns 200 and status ok", async () => {
    const res = await json(srv.base, "GET", "/api/health");
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, "ok");
    assert.ok(res.body.timestamp);
  });
});

describe("Auth flow", () => {
  const user = { email: "dev@example.com", password: "password123", name: "Dev" };
  let token;

  it("signs up a new user and never returns the password hash", async () => {
    const res = await json(srv.base, "POST", "/api/auth/signup", user);
    assert.strictEqual(res.status, 201);
    assert.ok(res.body.token);
    assert.strictEqual(res.body.user.email, user.email);
    assert.strictEqual(res.body.user.password, undefined);
    token = res.body.token;
  });

  it("rejects a duplicate signup with 409", async () => {
    const res = await json(srv.base, "POST", "/api/auth/signup", user);
    assert.strictEqual(res.status, 409);
  });

  it("rejects invalid signup input with 400", async () => {
    const res = await json(srv.base, "POST", "/api/auth/signup", { email: "nope", password: "short" });
    assert.strictEqual(res.status, 400);
    assert.ok(res.body.details.email);
    assert.ok(res.body.details.password);
  });

  it("logs in with correct credentials", async () => {
    const res = await json(srv.base, "POST", "/api/auth/login", { email: user.email, password: user.password });
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.token);
  });

  it("rejects a wrong password with 401", async () => {
    const res = await json(srv.base, "POST", "/api/auth/login", { email: user.email, password: "wrong-password" });
    assert.strictEqual(res.status, 401);
  });

  it("returns the current user for a valid token", async () => {
    const res = await json(srv.base, "GET", "/api/users/me", undefined, token);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.email, user.email);
    assert.strictEqual(res.body.password, undefined);
  });

  it("requires a token for protected routes", async () => {
    const res = await json(srv.base, "GET", "/api/users/me");
    assert.strictEqual(res.status, 401);
  });

  it("rejects a token signed with the old public default secret", async () => {
    const { default: jwt } = await import("jsonwebtoken");
    const forged = jwt.sign({ id: 1, email: user.email }, "change-me-in-production");
    const res = await json(srv.base, "GET", "/api/users/me", undefined, forged);
    assert.strictEqual(res.status, 401);
  });
});
