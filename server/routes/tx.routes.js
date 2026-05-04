import { Router } from "express";
const router = Router();

import { commitTx, getAllTx, getTx } from "../controllers/tx.controller";

router.post("/commit", commitTx);
router.get("/status", getAllTx);
router.get("/:hash", getTx);

export default router;
