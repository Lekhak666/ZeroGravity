import { relayerWallet } from "../config/provider";
import { ethers } from "ethers";

async function executeTransaction(txData) {
  const tx = {
    to: txData.to,
    value: ethers.parseEther(txData.amount),
  };

  const response = await relayerWallet.sendTransaction(tx);
  return response.hash;
}

export default { executeTransaction };
