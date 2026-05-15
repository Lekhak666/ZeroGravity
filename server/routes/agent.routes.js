import { Router } from "express";

import handleAgent from "../controllers/agent.controller.js";

import { getReveal } from "../services/revealStore.service.js";

const router = Router();

router.post("/chat", handleAgent);

router.get("/reveal/:hash", (req, res) => {
  const reveal = getReveal(req.params.hash);

  if (!reveal) {
    return res.status(404).json({
      error: "Reveal not found",
    });
  }

  res.json(reveal);
});

export default router;
