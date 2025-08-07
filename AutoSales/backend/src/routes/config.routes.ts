// src/routes/config.routes.ts
import { Router } from "express";
import { getConfig, putConfig } from "../controllers/config.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/config", authMiddleware, getConfig);
router.put("/config", authMiddleware, putConfig);

export default router;