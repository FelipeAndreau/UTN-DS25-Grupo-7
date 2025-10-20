// src/controllers/vehiculos.controller.ts

import { Request, Response } from "express";
import {
  listarVehiculos,
  registrarVehiculo,
  editarVehiculo,
  eliminarVehiculo,
} from "../services/vehiculos.service";

export const getVehiculos = async (req: Request, res: Response) => {
  try {
    console.log("📋 Obteniendo lista de vehículos");
    
    // Obtener parámetros de query para filtros opcionales
    const { estado, marca, anio, minPrecio, maxPrecio } = req.query;
    
    const vehiculos = await listarVehiculos();
    
    // Aplicar filtros si se proporcionan
    let vehiculosFiltrados = vehiculos;
    
    if (estado) {
      vehiculosFiltrados = vehiculosFiltrados.filter(v => v.estado === estado);
    }
    
    if (marca) {
      vehiculosFiltrados = vehiculosFiltrados.filter(v => 
        v.marca.toLowerCase().includes((marca as string).toLowerCase())
      );
    }
    
    if (anio) {
      vehiculosFiltrados = vehiculosFiltrados.filter(v => v.anio === Number(anio));
    }
    
    if (minPrecio) {
      vehiculosFiltrados = vehiculosFiltrados.filter(v => v.precio >= Number(minPrecio));
    }
    
    if (maxPrecio) {
      vehiculosFiltrados = vehiculosFiltrados.filter(v => v.precio <= Number(maxPrecio));
    }
    
    res.json({
      success: true,
      message: "Vehículos obtenidos exitosamente",
      data: vehiculosFiltrados,
      count: vehiculosFiltrados.length,
      total: vehiculos.length
    });
  } catch (error: any) {
    console.error("❌ Error obteniendo vehículos:", error);
    res.status(error.statusCode || 500).json({ 
      success: false,
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
    console.log("🗑️ Eliminando vehículo:", req.params.id);
    const vehiculoEliminado = await eliminarVehiculo(Number(req.params.id));
    res.json({ 
      success: true,
      message: "Vehículo eliminado exitosamente",
      data: vehiculoEliminado
    });
  } catch (error: any) {
    console.error("❌ Error eliminando vehículo:", error);
    res.status(error.statusCode || 500).json({ 
      success: false,
      message: error.message || "Error interno del servidor" 
    });
  }
};