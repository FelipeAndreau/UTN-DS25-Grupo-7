// src/routes/dashboard.routes.ts

import { Router } from "express";
import { getDashboardStats, getDashboard } from "../controllers/dashboard.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/stats", authMiddleware, getDashboardStats);
router.get("/", authMiddleware, getDashboard);

export default router;