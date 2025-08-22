// src/routes/config.routes.ts
import { Router } from "express";
import { getConfig, putConfig } from "../controllers/config.controller";

const router = Router();

router.get("/config", getConfig);
router.put("/config", putConfig);

export default router;