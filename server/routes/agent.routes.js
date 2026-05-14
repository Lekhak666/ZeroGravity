import { Router } from "express";
import { buildManagedCommit } from "../services/managedCommit.service.js";

const router = Router();

import handleAgent from "../controllers/agent.controller.js";

router.post("/chat", handleAgent);

export default router;
