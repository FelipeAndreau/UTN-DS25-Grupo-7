// src/controllers/ventas.controller.ts

import prisma from "../config/prisma";

// Define local types for Request and Response to resolve the import issue
type Request = {
  params: Record<string, string>;
  body: any;
};

type Response = {
  status: (code: number) => Response;
  json: (data: any) => void;
};

// Ensure the console object is explicitly typed to avoid TypeScript errors
const console = globalThis.console;

import {
  listarVentas,
  registrarVenta,
  editarVenta,
  eliminarVenta,
  obtenerVentaPorId,
} from "../services/ventas.service";

export const getVentas = async (_: Request, res: Response) => {
  try {
    console.log("📋 Obteniendo lista de ventas");
    const ventas = await listarVentas();
    
    res.json({
      success: true,
      message: "Ventas obtenidas exitosamente",
      data: ventas
    });
  } catch (error: any) {
    console.error("❌ Error obteniendo ventas:", error);
    res.status(error.statusCode || 500).json({ 
      success: false,
      message: error.message || "Error interno del servidor" 
    });
  }
};

export const postVenta = async (req: Request, res: Response) => {
  try {
    console.log("📥 Datos recibidos para crear venta:", req.body);
    
    const ventaData = req.body;
    const nuevaVenta = await registrarVenta(ventaData as any);
    
    res.status(201).json({
      success: true,
      message: "Venta registrada exitosamente",
      data: nuevaVenta
    });
  } catch (error: any) {
    console.error("❌ Error creando venta:", error);
    res.status(error.statusCode || 500).json({ 
      success: false,
      message: error.message || "Error interno del servidor" 
    });
  }
};

export const putVenta = async (req: Request, res: Response) => {
  try {
    console.log("📝 Datos recibidos para actualizar venta:", req.body);
    
    const ventaData = req.body;
    const ventaId = Number(req.params.id);
    
    const ventaActualizada = await editarVenta(ventaId, ventaData as any);
    
    res.json({
      success: true,
      message: "Venta actualizada exitosamente",
      data: ventaActualizada
    });
  } catch (error: any) {
    console.error("❌ Error actualizando venta:", error);
    res.status(error.statusCode || 500).json({ 
      success: false,
      message: error.message || "Error interno del servidor" 
    });
  }
};

export const deleteVenta = async (req: Request, res: Response) => {
  try {
    const ventaId = Number(req.params.id);
    const ventaEliminada = await eliminarVenta(ventaId);
    
    res.json({
      success: true,
      message: "Venta eliminada exitosamente",
      data: ventaEliminada
    });
  } catch (error: any) {
    console.error("❌ Error eliminando venta:", error);
    res.status(error.statusCode || 500).json({ 
      success: false,
      message: error.message || "Error interno del servidor" 
    });
  }
};

export const completarVenta = async (req: Request, res: Response) => {
  try {
    const ventaId = Number(req.params.id);
    console.log("🔄 Marcando venta como completada:", ventaId);

    // Obtener la venta para acceder al vehiculoId
    const venta = await obtenerVentaPorId(ventaId);

    // Actualizar el estado del vehículo a "Vendido"
    await prisma!.vehiculo.update({
      where: { id: venta.vehiculoId },
      data: { estado: "Vendido" }
    });

    res.json({
      success: true,
      message: "Venta completada exitosamente",
      data: venta
    });
  } catch (error: any) {
    console.error("❌ Error completando venta:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Error interno del servidor"
    });
  }
};
