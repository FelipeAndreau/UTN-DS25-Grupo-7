// src/controllers/config.controller.ts

import { Request, Response } from "express";
import { obtenerConfiguracion, actualizarConfiguracion } from "../services/config.service";

export const getConfig = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user?.id) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }
    const userId = user.id;
    const config = await obtenerConfiguracion(userId);
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const putConfig = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user?.id) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }
    const userId = user.id;
    await actualizarConfiguracion(userId, req.body);
    res.json({ message: "Configuración actualizada" });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};