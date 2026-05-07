import { commitTransaction } from "../services/commit.service.js";
import { getPool, findTx } from "../services/pool.service.js";

export async function commitTx(req, res) {
  try {
    const { to, amount, userAddress } = req.body;

    const hash = await commitTransaction({ to, amount }, userAddress);

    res.json({
      commitHash: hash,
      status: "queued",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export function getAllTx(req, res) {
  res.json(getPool());
}

export function getTx(req, res) {
  const tx = findTx(req.params.hash);

  if (!tx) {
    return res.status(404).json({ error: "Not found" });
  }

  res.json(tx);
}
