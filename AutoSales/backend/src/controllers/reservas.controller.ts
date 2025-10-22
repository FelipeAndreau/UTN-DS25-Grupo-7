// src/controllers/reservas.controller.ts

import { Request, Response } from "express";
import * as reservaService from "../services/reservas.service";
import { ReservaClienteView } from "../types/logs.types";
import prisma from "../config/prisma";

export const crearReserva = async (req: Request, res: Response) => {
  try {
    console.log("📥 Datos recibidos para crear reserva:", req.body);
    console.log("👤 Usuario en request:", req.user ? { id: req.user.id, email: req.user.email, rol: req.user.rol } : "NO USER FOUND");
    
    // Solo validamos que exista vehiculoId
    const { vehiculoId, clienteId, nombre, email, telefono } = req.body;
    if (!vehiculoId) {
      console.log("❌ vehiculoId es requerido");
      return res.status(400).json({ 
        success: false,
        message: "vehiculoId es requerido",
        error: {
          codigo: "VALIDATION_ERROR",
          mensaje: "vehiculoId es requerido",
          camposFaltantes: ["vehiculoId"]
        }
      });
    }

    // Determinar el cliente para la reserva
    let clienteParaReserva: string;
    
    // Determinar el cliente para la reserva según el tipo de usuario
    if (req.user?.id && req.user?.email) {
      console.log("🔍 Usuario autenticado, ID:", req.user.id, "Email:", req.user.email);

      // Buscar cliente existente por usuarioId primero (relación directa), fallback por email
      let cliente = await prisma.cliente.findFirst({
        where: {
          OR: [
            { usuarioId: req.user.id },
            { email: req.user.email }
          ]
        }
      });

      if (!cliente) {
        console.log("👤 Creando cliente vinculado a usuario real");
        // Para usuarios viewer, no vincular a usuario ya que no existe en DB
        if (req.user.rol === 'viewer') {
          cliente = await prisma.cliente.create({
            data: {
              nombre: "Usuario Viewer",
              email: req.user.email,
              telefono: "No especificado",
              tipo: "Particular",
              estado: "Activo",
              actividad: "Compra de vehículo"
            }
          });
        } else {
          // Obtener nombre real del usuario
          const usuarioDb = await prisma.usuario.findUnique({ where: { id: req.user.id } });

          cliente = await prisma.cliente.create({
            data: {
              nombre: usuarioDb?.nombre || "Usuario",
              email: req.user.email,
              telefono: "No especificado",
              tipo: "Particular",
              estado: "Activo",
              actividad: "Compra de vehículo",
              usuarioId: req.user.id
            }
          });
        }
        console.log("✅ Cliente creado y vinculado (usuarioId):", cliente.id);
      } else {
        // Si cliente existe pero no tiene usuarioId y corresponde al email, vincularlo (solo si no es viewer)
        if (!cliente.usuarioId && req.user.rol !== 'viewer') {
          await prisma.cliente.update({
            where: { id: cliente.id },
            data: { usuarioId: req.user.id }
          });
          console.log("🔗 Cliente existente vinculado a usuarioId");
        }
        console.log("✅ Cliente existente encontrado:", cliente.id);
      }

      clienteParaReserva = cliente.id;
    }
    // Si se proporciona clienteId específico, verificar que existe
    else if (clienteId) {
      const clienteExistente = await prisma.cliente.findUnique({
        where: { id: clienteId }
      });
      
      if (!clienteExistente) {
        return res.status(400).json({
          success: false,
          message: "Cliente especificado no existe"
        });
      }
      
      clienteParaReserva = clienteId;
    }
    // Si es una reserva pública con datos de contacto, crear cliente
    else if (nombre && email && telefono) {
      console.log("📝 Creando cliente público para reserva");
      
      // Buscar si ya existe un cliente con ese email
      let cliente = await prisma.cliente.findFirst({
        where: { email }
      });
      
      // Si no existe, crearlo
      if (!cliente) {
        cliente = await prisma.cliente.create({
          data: {
            nombre,
            email,
            telefono,
            tipo: "Particular",
            estado: "Activo",
            actividad: "Reserva de vehículo"
          }
        });
        console.log("✅ Cliente público creado:", cliente.id);
      }
      
      clienteParaReserva = cliente.id;
    }
    // En caso contrario, error - no se puede crear reserva sin datos del cliente
    else {
      return res.status(400).json({
        success: false,
        message: "Se requiere información del cliente para crear la reserva"
      });
    }

    // Agregar clienteId determinado
    const datosReserva = {
      ...req.body,
      clienteId: clienteParaReserva
    };

    const { reserva, reservaClienteView } = await reservaService.crearReserva(datosReserva);
    
    res.status(201).json({ 
      success: true,
      message: "Reserva creada exitosamente", 
      data: reserva,
      reservaClienteView: reservaClienteView
    });
  } catch (error: any) {
    console.error("❌ Error creando reserva:", error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Error interno del servidor",
      error: {
        codigo: "INTERNAL_ERROR",
        mensaje: error.message || "Error interno del servidor",
        camposFaltantes: []
      }
    });
  }
};

export const listarReservasAdmin = async (_req: Request, res: Response) => {
  try {
    console.log("📋 Obteniendo todas las reservas (Admin)");
    const reservas = await reservaService.listarReservasAdmin();
    res.json({
      success: true,
      message: "Reservas obtenidas exitosamente",
      data: reservas,
      count: reservas.length
    });
  } catch (error: any) {
    console.error("❌ Error obteniendo reservas:", error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Error interno del servidor" 
    });
  }
};

export const listarReservasCliente = async (req: Request, res: Response) => {
  try {
    const clienteId = req.params.clienteId;
    
    if (!clienteId) {
      return res.status(400).json({
        success: false,
        message: "clienteId es requerido"
      });
    }

    console.log("📋 Obteniendo reservas para cliente:", clienteId);
    const reservas = await reservaService.listarReservasCliente(clienteId);
    res.json({
      success: true,
      message: "Reservas del cliente obtenidas exitosamente",
      data: reservas,
      count: reservas.length
    });
  } catch (error: any) {
    console.error("❌ Error obteniendo reservas del cliente:", error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Error interno del servidor" 
    });
  }
};

export const obtenerMisReservas = async (req: Request, res: Response) => {
  try {
    const usuarioId = req.user?.id;
    const usuarioEmail = req.user?.email;

    if (!usuarioId) {
      return res.status(401).json({ 
        success: false,
        message: "Usuario no autenticado" 
      });
    }

    console.log("📋 Obteniendo reservas detalladas del usuario:", usuarioId, usuarioEmail);

    let reservasDetalladas: any[] = [];
    if (usuarioEmail) {
      const cliente = await prisma.cliente.findFirst({ where: { email: usuarioEmail } });
      if (cliente) {
        reservasDetalladas = await prisma.reserva.findMany({
          where: { clienteId: cliente.id },
          include: { vehiculo: true, cliente: true }
        });
      }
    }

    res.json({
      success: true,
      message: "Reservas obtenidas exitosamente",
      data: reservasDetalladas,
      count: reservasDetalladas.length
    });
  } catch (error: any) {
    console.error("❌ Error obteniendo reservas del usuario:", error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Error interno del servidor" 
    });
  }
};

export const cancelarReserva = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "ID de reserva inválido"
      });
    }

    console.log("📝 Cancelando reserva:", id);
    const reservaCancelada = await reservaService.cancelarReserva(Number(id));
    res.json({ 
      success: true,
      message: "Reserva cancelada exitosamente", 
      data: reservaCancelada 
    });
  } catch (error: any) {
    console.error("❌ Error cancelando reserva:", error);
    if (error.message.includes("no encontrada")) {
      return res.status(404).json({
        success: false,
        message: "Reserva no encontrada"
      });
    }
    res.status(500).json({ 
      success: false,
      message: error.message || "Error interno del servidor" 
    });
  }
};

export const eliminarReserva = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "ID de reserva inválido"
      });
    }
    try {
      console.log("🗑️ Eliminando reserva:", id);
      await reservaService.eliminarReserva(Number(id));
      res.json({ 
        success: true,
        message: "Reserva eliminada exitosamente" 
      });
    } catch (error: any) {
      console.error("❌ Error eliminando reserva:", error);
      if (error.message && error.message.includes("no encontrada")) {
        return res.status(404).json({
          success: false,
          message: "Reserva no encontrada"
        });
      }
      res.status(500).json({ 
        success: false,
        message: error.message || "Error interno del servidor" 
      });
    }
  } catch (error: any) {
    console.error("❌ Error eliminando reserva:", error);
    if (error.message.includes("no encontrada")) {
      return res.status(404).json({
        success: false,
        message: "Reserva no encontrada"
      });
    }
    res.status(500).json({ 
      success: false,
      message: error.message || "Error interno del servidor" 
    });
  }
};
