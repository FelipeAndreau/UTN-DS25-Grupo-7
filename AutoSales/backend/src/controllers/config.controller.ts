// src/controllers/config.controller.ts
import { Request, Response } from "express";
import { obtenerConfiguracion, actualizarConfiguracion } from "../services/config.service";

export async function getConfig(req: Request, res: Response) {
  const userId = req.user.id;
  const config = await obtenerConfiguracion(req.db, userId);
  if (!config) return res.status(404).json({ error: "Configuración no encontrada" });
  res.json(config);
}

export async function putConfig(req: Request, res: Response) {
  const userId = req.user.id;
  await actualizarConfiguracion(req.db, userId, req.body);
  res.status(204).send();
}