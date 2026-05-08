import { ethers } from "ethers";
import dotenv from "dotenv";

import abi from "./abi.json" with { type: "json" };

dotenv.config();

export const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

export const relayerWallet = new ethers.Wallet(
  process.env.ANVIL_RELAYER_PRIVATE_KEY,
  provider,
);

export const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  abi.abi,
  relayerWallet,
);
