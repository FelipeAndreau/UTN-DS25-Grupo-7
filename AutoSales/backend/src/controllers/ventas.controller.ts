import { Request, Response } from "express";
import {
  listarVentas,
  registrarVenta,
  editarVenta,
  eliminarVenta,
} from "../services/ventas.service";

export const getVentas = async (_: Request, res: Response) => {
  try {
    console.log("📋 Obteniendo lista de ventas");
    const ventas = await listarVentas();
    res.json(ventas);
  } catch (error: any) {
    console.error("❌ Error obteniendo ventas:", error);
    res.status(error.statusCode || 500).json({ 
      message: error.message || "Error interno del servidor" 
    });
  }
};

export const postVenta = async (req: Request, res: Response) => {
  try {
    console.log("📥 Datos recibidos para crear venta:", req.body);
    await registrarVenta(req.body);
    res.status(201).json({ message: "Venta creada" });
  } catch (error: any) {
    console.error("❌ Error creando venta:", error);
    res.status(error.statusCode || 500).json({ 
      message: error.message || "Error interno del servidor" 
    });
  }
};

export const putVenta = async (req: Request, res: Response) => {
  try {
    console.log("📝 Datos recibidos para actualizar venta:", req.body);
    await editarVenta(Number(req.params.id), req.body);
    res.json({ message: "Venta actualizada" });
  } catch (error: any) {
    console.error("❌ Error actualizando venta:", error);
    res.status(error.statusCode || 500).json({ 
      message: error.message || "Error interno del servidor" 
    });
  }
};

export const deleteVenta = async (req: Request, res: Response) => {
  try {
    await eliminarVenta(Number(req.params.id));
    res.json({ message: "Venta eliminada" });
  } catch (error: any) {
    console.error("❌ Error eliminando venta:", error);
    res.status(error.statusCode || 500).json({ 
      message: error.message || "Error interno del servidor" 
    });
  }
};