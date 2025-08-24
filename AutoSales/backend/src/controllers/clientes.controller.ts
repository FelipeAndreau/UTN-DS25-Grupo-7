// src/controllers/clientes.controller.ts
import { Request, Response } from "express";
import {
  listarClientes,
  registrarCliente,
  editarCliente,
  eliminarCliente,
} from "../services/clientes.service"

export const getClientes = async (_: Request, res: Response) => {
  const clientes = await listarClientes();
  res.json(clientes);
};

export const postCliente = async (req: Request, res: Response) => {
  try {
    console.log("📥 Datos recibidos para crear cliente:", req.body);
    await registrarCliente(req.body);
    res.status(201).json({ message: "Cliente creado" });
  } catch (error: any) {
    console.error("❌ Error creando cliente:", error);
    res.status(error.statusCode || 500).json({ 
      message: error.message || "Error interno del servidor" 
    });
  }
};

export const putCliente = async (req: Request, res: Response) => {
  try {
    console.log("📝 Datos recibidos para actualizar cliente:", req.body);
    await editarCliente(req.params.id, req.body);
    res.json({ message: "Cliente actualizado" });
  } catch (error: any) {
    console.error("❌ Error actualizando cliente:", error);
    res.status(error.statusCode || 500).json({ 
      message: error.message || "Error interno del servidor" 
    });
  }
};

export const deleteCliente = async (req: Request, res: Response) => {
  try {
    await eliminarCliente(req.params.id);
    res.json({ message: "Cliente eliminado" });
  } catch (error: any) {
    console.error("❌ Error eliminando cliente:", error);
    res.status(error.statusCode || 500).json({ 
      message: error.message || "Error interno del servidor" 
    });
  }
};