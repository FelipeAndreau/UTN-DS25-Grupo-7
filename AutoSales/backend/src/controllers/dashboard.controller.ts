// src/controllers/dashboard.controller.ts

import { Request, Response } from "express";
import { obtenerDashboardStats } from "../services/dashboard.service";
import { LogsService } from "../services/logs.service";

export const getDashboardStats = async (_: Request, res: Response) => {
  try {
    const stats = await obtenerDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error("Error en getDashboardStats:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const [stats, logs] = await Promise.all([
      obtenerDashboardStats(),
      LogsService.obtenerTodosLosLogs()
    ]);

    res.json({
      statistics: stats,
      logs: logs.slice(0, 10), // Últimos 10 logs
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error en getDashboard:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};