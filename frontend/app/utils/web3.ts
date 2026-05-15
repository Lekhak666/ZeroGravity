"use client";

import { ethers } from "ethers";
import artifact from "./CommitRegistry.json";
import type { WalletClient } from "viem";

const CONTRACT_ADDRESS = "0x1a668bb4746fe78e104aa0e1f033fa8c9b944320";

export async function getContract(walletClient: WalletClient) {
  if (!walletClient.account) {
    throw new Error("Wallet account not found");
  }

  const provider = new ethers.BrowserProvider(walletClient.transport);

  const signer = await provider.getSigner(walletClient.account.address);

  return new ethers.Contract(CONTRACT_ADDRESS, artifact.abi, signer);
}
