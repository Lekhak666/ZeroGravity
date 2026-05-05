import { relayerWallet } from "../config/provider.js";
import { ethers } from "ethers";

export async function executeTransaction(txData) {
  const tx = {
    to: txData.to,
    value: ethers.parseEther(txData.amount),
  };

  const response = await relayerWallet.sendTransaction(tx);
  return response.hash;
}
