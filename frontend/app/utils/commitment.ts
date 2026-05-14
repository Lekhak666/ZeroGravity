import { ethers } from "ethers";

export interface CommitmentResult {
  commitHash: string;
  nonce: number;
  salt: string;
}

export function generateCommitment(
  to: string,
  amount: bigint | number | string,
): CommitmentResult {
  const nonce: number = crypto.getRandomValues(new Uint32Array(1))[0];

  const salt: string = ethers.hexlify(
    crypto.getRandomValues(new Uint8Array(32)),
  );

  const commitHash: string = ethers.keccak256(
    ethers.AbiCoder.defaultAbiCoder().encode(
      ["address", "uint256", "uint256", "bytes32"],
      [to, amount, nonce, salt],
    ),
  );

  return {
    commitHash,
    nonce,
    salt,
  };
}
