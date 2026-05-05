import { revealAndExecute } from "./reveal.service.js";

const pool = [];

export function addToPool(tx) {
  pool.push(tx);
}

export function getPool() {
  return pool;
}

export function findTx(hash) {
  return pool.find((tx) => tx.hash === hash);
}

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
