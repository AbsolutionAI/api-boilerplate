import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

// Load .env into process.env (Node >= 20.12 built-in, no dependency).
// Variables already set in the real environment win over .env values.
const envFile = process.env.ENV_FILE || path.join(root, ".env");
if (fs.existsSync(envFile) && typeof process.loadEnvFile === "function") {
  process.loadEnvFile(envFile);
}

const KNOWN_PLACEHOLDERS = new Set([
  "",
  "change-me-in-production",
  "change-me-to-a-long-random-string",
]);
const DEV_FALLBACK_SECRET = "insecure-dev-only-secret";

export function resolveJwtSecret(env = process.env) {
  const secret = env.JWT_SECRET ?? "";
  const weak = KNOWN_PLACEHOLDERS.has(secret) || secret.length < 32;
  if (!weak) return secret;
  if (env.NODE_ENV === "production") {
    throw new Error(
      "JWT_SECRET is missing, a placeholder, or shorter than 32 characters. " +
        "Refusing to start with NODE_ENV=production. Generate one with: " +
        "node -e \"console.log(require('crypto').randomBytes(48).toString('hex'))\""
    );
  }
  if (env.NODE_ENV !== "test") {
    console.warn(
      "[config] WARNING: JWT_SECRET is missing or weak; tokens are NOT secure. " +
        "Set a random value of 32+ characters in .env before deploying."
    );
  }
  return secret && !KNOWN_PLACEHOLDERS.has(secret) ? secret : DEV_FALLBACK_SECRET;
}

export const config = {
  port: parseInt(process.env.PORT || "4000", 10),
  jwtSecret: resolveJwtSecret(),
  jwtExpiresIn: "7d",
  rateLimitWindow: 15 * 60 * 1000,
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
};
