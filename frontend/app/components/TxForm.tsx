"use client";

import { useState } from "react";
import axios from "axios";
import { ethers } from "ethers";

import { useAccount, useWalletClient } from "wagmi";

import { generateCommitment } from "../utils/commitment";
import { getContract } from "../utils/web3";

export default function TxForm() {
  const [mode, setMode] = useState("self");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const handleSubmit = async () => {
    if (!isConnected || !walletClient) {
      alert("Connect wallet first");
      return;
    }

    if (!ethers.isAddress(to)) {
      alert("Invalid recipient address");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Invalid amount");
      return;
    }

    setLoading(true);

    try {
      const contract = await getContract(walletClient);

      // SELF-CUSTODY
      if (mode === "self") {
        const { commitHash, nonce, salt } = generateCommitment(to, amount);

        localStorage.setItem(
          commitHash,
          JSON.stringify({
            to,
            amount,
            nonce,
            salt,
          }),
        );

        const tx = await contract.commit(commitHash);

        await tx.wait();

        await axios.post("http://localhost:5000/self/commit", { commitHash });

        alert("Commit sent on-chain");
      }

      // AI MANAGED
      if (mode === "managed") {
        await axios.post("http://localhost:5000/api/agent/chat", {
          prompt: `commit ${amount} to ${to}`,
        });

        alert("AI commit queued");
      }

      setTo("");
      setAmount("");
    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 rounded-2xl p-6 border border-zinc-800 bg-zinc-950/60 backdrop-blur-xl">
      {/* mode selector */}
      <div className="flex gap-3">
        {["self", "managed"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`
              px-5 py-2 rounded-xl transition-all
              ${
                mode === m
                  ? "bg-gradient-to-r from-violet-600 to-fuchsia-500"
                  : "bg-zinc-800 hover:bg-zinc-700"
              }
            `}
          >
            {m === "self" ? "Self Custody" : "AI Managed"}
          </button>
        ))}
      </div>

      {/* recipient */}
      <input
        className="
          w-full p-3 rounded-xl
          bg-zinc-900 border border-zinc-700
          focus:outline-none
          focus:border-violet-500
        "
        placeholder="Recipient Address"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />

      {/* amount */}
      <input
        className="
          w-full p-3 rounded-xl
          bg-zinc-900 border border-zinc-700
          focus:outline-none
          focus:border-violet-500
        "
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      {/* submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="
          w-full py-3 rounded-xl
          bg-gradient-to-r
          from-violet-600
          to-fuchsia-500
          hover:scale-[1.02]
          transition-all
          disabled:opacity-50
        "
      >
        {loading ? "Processing..." : "Commit Transaction"}
      </button>
    </div>
  );
}
