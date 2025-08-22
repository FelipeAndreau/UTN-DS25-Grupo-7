// src/controllers/config.controller.ts
import { Request, Response } from "express";
import { obtenerConfiguracion, actualizarConfiguracion } from "../services/config.service";

export const getConfig = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const config = await obtenerConfiguracion(userId);
  res.json(config);
};

export const putConfig = async (req: Request, res: Response) => {
  const userId = req.user.id;
  await actualizarConfiguracion(userId, req.body);
  res.json({ message: "Configuración actualizada" });
};