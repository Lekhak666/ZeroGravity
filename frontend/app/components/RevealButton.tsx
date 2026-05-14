"use client";

import { revealCommit } from "../utils/reveal";

export default function RevealButton() {
  async function handleReveal() {
    const keys = Object.keys(localStorage);

    const commitKey = keys.find((k) => k.startsWith("0x"));

    if (!commitKey) {
      alert("No commit found");
      return;
    }

    const data = JSON.parse(localStorage.getItem(commitKey) || "{}");

    try {
      const txHash = await revealCommit(
        data.to,
        data.amount,
        data.nonce,
        data.salt,
      );

      alert(`Revealed: ${txHash}`);
    } catch (err) {
      console.error(err);
      alert("Reveal failed (too early?)");
    }
  }

  return (
    <button
      onClick={handleReveal}
      className="w-full py-2 rounded-lg bg-green-600"
    >
      Reveal Commitment
    </button>
  );
}
