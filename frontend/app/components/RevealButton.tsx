"use client";

import { useState } from "react";
import axios from "axios";
import { useWalletClient } from "wagmi";
import { revealCommit } from "../utils/reveal";

export default function RevealButton() {
  const { data: walletClient } = useWalletClient();
  const [revealing, setRevealing] = useState(false);

  async function handleReveal() {
    if (revealing) return;

    if (!walletClient) {
      alert("Connect wallet first");
      return;
    }

    setRevealing(true);

    try {
      let data;

      const managed = localStorage.getItem("managedCommit");

      if (managed) {
        const res = await axios.get(
          `http://localhost:5000/api/agent/reveal/${managed}`,
        );

        data = res.data;
      } else {
        const key = localStorage.getItem("latestCommit");

        if (!key) {
          alert("No commit found");
          setRevealing(false);
          return;
        }

        data = JSON.parse(localStorage.getItem(key) || "{}");
      }

      const txHash = await revealCommit(
        walletClient,
        data.to,
        data.amount,
        data.nonce,
        data.salt,
      );

      alert(`Revealed: ${txHash}`);
    } catch (err) {
      console.error(err);
      alert("Reveal failed");
    } finally {
      setRevealing(false);
    }
  }

  return (
    <button
      onClick={handleReveal}
      disabled={revealing}
      className="w-full py-2 rounded-lg bg-green-600 disabled:opacity-50"
    >
      {revealing ? "Revealing..." : "Reveal Commitment"}
    </button>
  );
}
