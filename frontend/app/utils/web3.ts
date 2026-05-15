"use client";

import { ethers } from "ethers";
import artifact from "./CommitRegistry.json";
import type { WalletClient } from "viem";

const CONTRACT_ADDRESS = "0xa09Ed01DD3e29e431301a4CA327411C268344C79";

export async function getContract(walletClient: WalletClient) {
  if (!walletClient.account) {
    throw new Error("Wallet account not found");
  }

  const provider = new ethers.BrowserProvider(walletClient.transport);

  const signer = await provider.getSigner(walletClient.account.address);

  return new ethers.Contract(CONTRACT_ADDRESS, artifact.abi, signer);
}
