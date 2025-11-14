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
    
    // Obtener parámetros de query para filtros opcionales y paginación
    const { estado, marca, anio, minPrecio, maxPrecio, page = 1, limit = 50 } = req.query;
    
    const vehiculos = await listarVehiculos();
    
    // Aplicar filtros si se proporcionan
    let vehiculosFiltrados = vehiculos;
    
    // Para rutas públicas, solo mostrar vehículos disponibles
    if (req.originalUrl.includes('/public/')) {
      vehiculosFiltrados = vehiculosFiltrados.filter(v => v.estado === 'Disponible');
    }
    
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
    
    // Aplicar paginación
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const total = vehiculosFiltrados.length;
    const totalPages = Math.ceil(total / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedVehiculos = vehiculosFiltrados.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      message: "Vehículos obtenidos exitosamente",
      data: paginatedVehiculos,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages
      }
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
    const vehiculo = await registrarVehiculo(req.body);
    res.status(201).json({ 
      success: true,
      message: "Vehículo creado",
      data: vehiculo
    });
  } catch (error: any) {
    console.error("❌ Error creando vehículo:", error);
    res.status(error.statusCode || 500).json({ 
      success: false,
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
