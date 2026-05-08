import { contract } from "../config/provider.js";
import dotenv from "dotenv";
dotenv.config();

export default async function commitHash(commitHash) {
  if (!/^0x[a-fA-F0-9]{64}$/.test(commitHash)) {
    throw new Error("Invalid hash");
  }

  const tx = await contract.commit(commitHash);

  const receipt = await tx.wait();

  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
  };
}
