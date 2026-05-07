import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

export const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

export const relayerWallet = new ethers.Wallet(
  process.env.RELAYER_PRIVATE_KEY,
  provider,
);

export const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  //   require("./abi.json"), // paste ABI here
  relayerWallet,
);
