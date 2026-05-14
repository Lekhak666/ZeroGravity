import express from "express";
import contract from "../services/ethers.service.js";

const router = express.Router();

router.post("/commit", async (req, res) => {
  try {
    const { commitHash, encryptedReveal } = req.body;

    console.log(encryptedReveal);

    const tx = await contract.commit(commitHash);

    await tx.wait();

    res.json({
      success: true,
      txHash: tx.hash,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

export default router;
