import { ethers } from "ethers";
require("dotenv").config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

const relayerWallet = new ethers.Wallet(
  process.env.RELAYER_PRIVATE_KEY,
  provider,
);

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  require("./abi.json"), // paste ABI here
  relayerWallet,
);

export default {
  provider,
  relayerWallet,
  contract,
};
