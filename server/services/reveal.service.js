import { contract } from "../config/provider.js";
import { executeTransaction } from "./execution.service.js";

export async function revealAndExecute(tx) {
  try {
    const txHash = await executeTransaction(tx.txData);

    const revealTx = await contract.markRevealed(tx.hash);
    await revealTx.wait();

    tx.status = "executed";
    tx.txHash = txHash;
  } catch (err) {
    tx.status = "failed";
    tx.error = err.message;
  }
}
