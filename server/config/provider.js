import { ethers } from "ethers";
import dotenv from "dotenv";

import abi from "./abi.json" with { type: "json" };

dotenv.config();

const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!PRIVATE_KEY) {
  throw new Error("Missing PRIVATE_KEY in .env file");
}

if (!PRIVATE_KEY.startsWith("0x")) {
  throw new Error("PRIVATE_KEY must start with 0x");
}

if (PRIVATE_KEY.length !== 66) {
  throw new Error(`Invalid PRIVATE_KEY length: ${PRIVATE_KEY.length}`);
}

export const provider = new ethers.JsonRpcProvider(RPC_URL);

export const relayerWallet = new ethers.Wallet(
  process.env.PRIVATE_KEY,
  provider,
);

export const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  abi.abi,
  relayerWallet,
);
