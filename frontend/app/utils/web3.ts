"use client";

import { ethers } from "ethers";
import artifact from "./CommitRegistry.json";
import type { WalletClient } from "viem";

const CONTRACT_ADDRESS = "0xB8101132fa8a75d996476327EF56F5e5d7be40A0";

export async function getContract(walletClient: WalletClient) {
  if (!walletClient.account) {
    throw new Error("Wallet account not found");
  }

  const provider = new ethers.BrowserProvider(walletClient.transport);

  const signer = await provider.getSigner(walletClient.account.address);

  return new ethers.Contract(CONTRACT_ADDRESS, artifact.abi, signer);
}
