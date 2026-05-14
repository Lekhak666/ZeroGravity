import express from "express";
import { commit } from "../services/commit.service.js";

const router = express.Router();

router.post("/commit", async (req, res) => {
  try {
    const { commitHash } = req.body;

    const tx = await commit(commitHash);

    res.json({
      success: true,
      tx,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

export default router;
