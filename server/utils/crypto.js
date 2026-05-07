import { randomBytes, createHash } from "crypto";

export function createCommit(txData) {
  const salt = randomBytes(16).toString("hex");

  const hash = createHash("sha256")
    .update(JSON.stringify(txData) + salt)
    .digest("hex");

  return { hash, salt };
}
