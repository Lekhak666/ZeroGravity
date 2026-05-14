import { ethers } from "ethers";

export function generateCommitment(payload: any, nonce: number, salt: string) {
  return ethers.keccak256(
    ethers.AbiCoder.defaultAbiCoder().encode(
      ["string", "uint256", "string"],
      [JSON.stringify(payload), nonce, salt],
    ),
  );
}
