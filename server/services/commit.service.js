import { createCommit } from "../utils/crypto";
import { contract } from "../config/provider";
import { addToPool } from "./pool.service";

async function commitTransaction(txData, userAddress) {
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

export default { commitTransaction };
