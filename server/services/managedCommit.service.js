import crypto from "crypto";
import { ethers } from "ethers";

export function buildManagedCommit(parsed) {
  const nonce = crypto.randomInt(1e9);

  const salt = "0x" + crypto.randomBytes(32).toString("hex");

  const to = parsed.to;

  const amount = parsed.amount;

  const commitHash = ethers.keccak256(
    ethers.AbiCoder.defaultAbiCoder().encode(
      ["address", "uint256", "uint256", "bytes32"],
      [to, amount, nonce, salt],
    ),
  );

  return {
    commitHash,

    revealData: {
      to,
      amount,
      nonce,
      salt,
    },
  };
}
