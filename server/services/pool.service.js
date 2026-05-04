import { revealAndExecute } from "./reveal.service";

const pool = [];

function addToPool(tx) {
  pool.push(tx);
}

function getPool() {
  return pool;
}

function findTx(hash) {
  return pool.find((tx) => tx.hash === hash);
}

export default {
  addToPool,
  getPool,
  findTx,
};

const DELAY = 15000;

setInterval(() => {
  const now = Date.now();

  pool.forEach((tx) => {
    if (tx.status === "committed" && now - tx.createdAt > DELAY) {
      tx.status = "revealing";
      revealAndExecute(tx);
    }
  });
}, 5000);
