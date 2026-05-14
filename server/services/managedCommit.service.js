import crypto from "crypto";
import { ethers } from "ethers";

export function buildManagedCommit(payload) {
  const nonce = crypto.randomInt(1e9);

  const salt = crypto.randomBytes(32).toString("hex");

  const commitHash = ethers.keccak256(
    ethers.AbiCoder.defaultAbiCoder().encode(
      ["string", "uint256", "string"],
      [JSON.stringify(payload), nonce, salt],
    ),
  );

  return {
    commitHash,
    revealData: {
      payload,
      nonce,
      salt,
    },
  };
}
