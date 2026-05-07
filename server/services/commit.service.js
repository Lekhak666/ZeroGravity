import { createCommit } from "../utils/crypto.js";
import { contract } from "../config/provider.js";
import { addToPool } from "./pool.service.js";

export async function commitTransaction(txData, userAddress) {
  const { hash, salt } = createCommit(txData);

  // on-chain commit
  const tx = await contract.commit(hash);
  await tx.wait();

  const newTx = {
    hash,
    salt,
    txData,
    userAddress,
    status: "committed",
    createdAt: Date.now(),
  };

  addToPool(newTx);

  return hash;
}
