"use client";

import { useState } from "react";
import axios from "axios";
import { generateCommitHash } from "../utils/hash";

export default function TxForm() {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async () => {
    const secret = Math.random().toString(36).substring(2);

    const commitHash = generateCommitHash(to, amount, secret);

    try {
    await axios.post("http://localhost:5000/commit", {
      to,
      amount,
      secret,
      commitHash,});
      
      alert("Transaction sent privately!");
    } catch {
      alert("Backend not running yet");
    }

 return (
  <div className="space-y-3">
    <input
      className="w-full p-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:shadow-purple-500/30"
      placeholder="Recipient Address"
      onChange={(e) => setTo(e.target.value)}
    />

    <input
      className="w-full p-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:shadow-purple-500/30"
      placeholder="Amount"
      onChange={(e) => setAmount(e.target.value)}
    />

    <button
      onClick={handleSubmit}
      className="w-full py-2 rounded-lg bg-blue-500 hover:bg-blue-600 hover:scale-[1.02]"
    >
      Send Privately
    </button>
  </div>
    );
  }
}