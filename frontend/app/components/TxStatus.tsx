"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function TxStatus() {
  const [loading, setLoading] = useState(true);

  const [txs, setTxs] = useState([]);

  useEffect(() => {
    const fetchTxs = async () => {
      setLoading(true);

      try {
        const res = await axios.get("http://localhost:5000/api/tx/status");

        setTxs(res.data);
      } catch (err) {
        console.log("Backend unavailable");
      }

      setLoading(false);
    };

    fetchTxs();

    const interval = setInterval(fetchTxs, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h3 className="text-sm text-gray-300 mb-2">Transaction Pool</h3>

      {loading && <p className="text-xs text-gray-400">Fetching pool...</p>}

      {!loading && txs.length === 0 && (
        <p className="text-xs text-gray-400">No private transactions yet 👀</p>
      )}

      {txs.map((tx: any, i) => (
        <div
          key={i}
          className="p-3 mb-2 rounded-lg bg-white/10 border border-white/20 hover:scale-[1.02]"
        >
          <p className="text-sm">To: {tx.to}</p>

          <p className="text-xs">
            Status:{" "}
            <span
              className={
                tx.status === "private"
                  ? "text-yellow-400"
                  : tx.status === "revealed"
                    ? "text-blue-400"
                    : "text-green-400"
              }
            >
              {tx.status}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}
