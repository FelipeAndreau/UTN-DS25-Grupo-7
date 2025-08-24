// src/controllers/vehiculos.controller.ts
import { Request, Response } from "express";
import {
  listarVehiculos,
  registrarVehiculo,
  editarVehiculo,
  eliminarVehiculo,
} from "../services/vehiculos.service";

export const getVehiculos = async (_: Request, res: Response) => {
  try {
    console.log("📋 Obteniendo lista de vehículos");
    const vehiculos = await listarVehiculos();
    res.json(vehiculos);
  } catch (error: any) {
    console.error("❌ Error obteniendo vehículos:", error);
    res.status(error.statusCode || 500).json({ 
      message: error.message || "Error interno del servidor" 
    });
  }
};

export const postVehiculo = async (req: Request, res: Response) => {
  try {
    console.log("📥 Datos recibidos para crear vehículo:", req.body);
    await registrarVehiculo(req.body);
    res.status(201).json({ message: "Vehículo creado" });
  } catch (error: any) {
    console.error("❌ Error creando vehículo:", error);
    res.status(error.statusCode || 500).json({ 
      message: error.message || "Error interno del servidor" 
    });
  }
};

export const putVehiculo = async (req: Request, res: Response) => {
  try {
    console.log("📝 Datos recibidos para actualizar vehículo:", req.body);
    await editarVehiculo(Number(req.params.id), req.body);
    res.json({ message: "Vehículo actualizado" });
  } catch (error: any) {
    console.error("❌ Error actualizando vehículo:", error);
    res.status(error.statusCode || 500).json({ 
      message: error.message || "Error interno del servidor" 
    });
  }
};

export const deleteVehiculo = async (req: Request, res: Response) => {
  try {
    await eliminarVehiculo(Number(req.params.id));
    res.json({ message: "Vehículo eliminado" });
  } catch (error: any) {
    console.error("❌ Error eliminando vehículo:", error);
    res.status(error.statusCode || 500).json({ 
      message: error.message || "Error interno del servidor" 
    });
  }
};