// src/controllers/dashboard.controller.ts
import { Request, Response } from "express";
import { obtenerDashboardStats } from "../services/dashboard.service";

export const getDashboardStats = async (_: Request, res: Response) => {
  try {
    const stats = await obtenerDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error("Error en getDashboardStats:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};