import { describe, it } from "node:test";
import assert from "node:assert";

process.env.NODE_ENV = "test";
const { resolveJwtSecret } = await import("../src/config.js");

describe("JWT secret resolution", () => {
  it("accepts a strong secret", () => {
    const s = "a".repeat(40);
    assert.strictEqual(resolveJwtSecret({ JWT_SECRET: s, NODE_ENV: "production" }), s);
  });

  for (const bad of [undefined, "", "change-me-in-production", "change-me-to-a-long-random-string", "short"]) {
    it(`refuses to start in production with JWT_SECRET=${JSON.stringify(bad)}`, () => {
      assert.throws(() => resolveJwtSecret({ JWT_SECRET: bad, NODE_ENV: "production" }), /JWT_SECRET/);
    });
  }

  it("never falls back to a published placeholder outside production", () => {
    const s = resolveJwtSecret({ JWT_SECRET: "change-me-to-a-long-random-string", NODE_ENV: "test" });
    assert.notStrictEqual(s, "change-me-to-a-long-random-string");
    assert.notStrictEqual(s, "change-me-in-production");
  });
});
