const { createCommit } = require("../utils/crypto");
const { contract } = require("../config/provider");
const { addToPool } = require("./pool.service");

async function commitTransaction(txData, userAddress) {
  const { hash, salt } = createCommit(txData);

  // on-chain commit
  const tx = await contract.commit(hash);
  await tx.wait();

  const newTx = {
    hash,
    salt,
    txData,
    userAddress,
    status: "committed",
    createdAt: Date.now(),
  };

  addToPool(newTx);

  return hash;
}

module.exports = { commitTransaction };
