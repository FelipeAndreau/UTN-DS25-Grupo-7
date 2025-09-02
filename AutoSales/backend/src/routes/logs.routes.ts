// src/routes/logs.routes.ts
import { Router } from "express";
import { getLogs, getLogStats } from "../controllers/logs.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/requireRoleMiddleware";

const router = Router();

// Solo admin puede acceder a los logs
router.get("/", authMiddleware, requireRole(["admin"]), getLogs);
router.get("/stats", authMiddleware, requireRole(["admin"]), getLogStats);

export default router;
