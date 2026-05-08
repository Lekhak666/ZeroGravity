import { Router } from "express";

const router = Router();

import handleAgent from "../controllers/agent.controller.js";

router.post("/chat", handleAgent);

export default router;
