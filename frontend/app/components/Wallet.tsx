"use client";

import { useState } from "react";
import { connectWallet } from "../utils/web3";

export default function Wallet() {
  const [address, setAddress] = useState("");

  const handleConnect = async () => {
    try {
      const addr = await connectWallet();
      setAddress(addr);
    } catch (err) {
      console.error(err);
    }
  };

  return (
  <div className="text-center">
    {address ? (
      <p className="text-sm text-green-400">
        Connected: {address.slice(0, 6)}...{address.slice(-4)}
      </p>
    ) : (
      <button
        onClick={handleConnect}
        className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-[1.03] active:scale-[0.97]
        shadow-lg shadow-purple-500/30"> 
        
        Connect Wallet
      </button>
    )}
  </div>
);
}