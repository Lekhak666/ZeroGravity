"use client";

import { useState } from "react";
import axios from "axios";

import { generateCommitment } from "../utils/commitment";

export default function TxForm() {
  const [mode, setMode] = useState("self");

  const [to, setTo] = useState("");

  const [amount, setAmount] = useState("");

  const handleSubmit = async () => {
    try {
      // SELF CUSTODY
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

        await axios.post("http://localhost:5000/self/commit", {
          commitHash,
        });

        alert("Self-custody commit sent");
      }

      // MANAGED MODE
      if (mode === "managed") {
        await axios.post("http://localhost:5000/api/agent/chat", {
          prompt: `commit ${amount} to ${to}`,
        });

        alert("Managed AI commit sent");
      }
    } catch (err) {
      console.error(err);

      alert("Request failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setMode("self")}
          className={
            mode === "self"
              ? "bg-blue-600 px-4 py-2 rounded"
              : "bg-gray-700 px-4 py-2 rounded"
          }
        >
          Self Custody
        </button>

        <button
          onClick={() => setMode("managed")}
          className={
            mode === "managed"
              ? "bg-purple-600 px-4 py-2 rounded"
              : "bg-gray-700 px-4 py-2 rounded"
          }
        >
          AI Managed
        </button>
      </div>

      <input
        className="w-full p-2 rounded-lg bg-white/10 border"
        placeholder="Recipient Address"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />

      <input
        className="w-full p-2 rounded-lg bg-white/10 border"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="w-full py-2 rounded-lg bg-blue-500"
      >
        Commit Transaction
      </button>
    </div>
  );
}
