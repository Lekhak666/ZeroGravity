import { commitTransaction } from "../services/commit.service";
import { getPool, findTx } from "../services/pool.service";

async function commitTx(req, res) {
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

function getAllTx(req, res) {
  res.json(getPool());
}

function getTx(req, res) {
  const tx = findTx(req.params.hash);

  if (!tx) {
    return res.status(404).json({ error: "Not found" });
  }

  res.json(tx);
}

export default {
  commitTx,
  getAllTx,
  getTx,
};
