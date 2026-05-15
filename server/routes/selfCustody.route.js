import express from "express";

const router = express.Router();

router.post("/commit", async (req, res) => {
  try {
    const { commitHash } = req.body;

    console.log("Self commit recorded:", commitHash);

    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

export default router;
