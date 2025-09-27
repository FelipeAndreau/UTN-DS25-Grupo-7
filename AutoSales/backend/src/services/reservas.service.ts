// src/services/reservas.service.ts

import prisma from "../config/prisma"
import { CrearReservaDTO, ReservaResponse } from "../types/reservas.types"
import { LogsService } from "./logs.service"
import { ReservaClienteView } from "../types/logs.types"

export const crearReserva = async (data: CrearReservaDTO): Promise<{ reserva: ReservaResponse; reservaClienteView: ReservaClienteView }> => {
  try {
    // Validaciones
    if (!data.vehiculoId) {
      LogsService.logErrorValidacion(
        data.clienteId || "desconocido",
        "vehiculoId es requerido",
        ["vehiculoId"]
      );
      throw new Error("vehiculoId es requerido");
    }

    // Si no hay clienteId, usar un cliente genérico por defecto
    let clienteId = data.clienteId || "cliente-anonimo";
    
    // Verificar si el cliente anónimo existe, si no, crearlo
    if (clienteId === "cliente-anonimo") {
      const clienteExistente = await prisma.cliente.findUnique({
        where: { id: "cliente-anonimo" }
      });
      
      if (!clienteExistente) {
        await prisma.cliente.create({
          data: {
            id: "cliente-anonimo",
            nombre: "Cliente Anónimo",
            email: "anonimo@autosales.com",
            telefono: "000-000-0000",
            tipo: "Particular",
            estado: "Activo",
            actividad: "Sin especificar"
          }
        });
      }
    }
    
    // Verificar que el vehículo existe y está disponible
    const vehiculo = await prisma.vehiculo.findUnique({
      where: { id: data.vehiculoId }
    });
    
    if (!vehiculo) {
      LogsService.logErrorValidacion(
        clienteId,
        "Vehículo no encontrado",
        [`vehiculoId=${data.vehiculoId}`]
      );
      throw new Error("Vehículo no encontrado");
    }
    
    if (vehiculo.estado !== "Disponible") {
      LogsService.logErrorValidacion(
        clienteId,
        "Vehículo no disponible para reserva",
        [`estado=${vehiculo.estado}`]
      );
      throw new Error("Vehículo no disponible para reserva");
    }

    // Obtener datos del cliente para el log
    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId }
    });
    
    // Crear la reserva
    const reservaData: any = {
      clienteId,
      vehiculoId: data.vehiculoId
    };

    // Agregar fechaVisita si está presente
    if (data.fechaVisita) {
      reservaData.fechaVisita = new Date(data.fechaVisita);
      console.log("📅 Fecha de visita configurada:", reservaData.fechaVisita);
    }

    const nuevaReserva = await prisma.reserva.create({
      data: reservaData
    });
    
    // Actualizar el estado del vehículo a "Reservado"
    await prisma.vehiculo.update({
      where: { id: data.vehiculoId },
      data: { estado: "Reservado" }
    });

    // Crear log de la reserva
    LogsService.logCrearReserva(
      clienteId,
      cliente?.nombre || "Cliente Anónimo",
      nuevaReserva.id.toString(),
      data.vehiculoId.toString(),
      nuevaReserva.fecha.toISOString(),
      "confirmada"
    );

    // Crear vista para el cliente
    const reservaClienteView: ReservaClienteView = {
      codigoReserva: `RES-${nuevaReserva.id}`,
      servicio: `${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.anio})`,
      fecha: nuevaReserva.fecha.toISOString().split('T')[0],
      hora: nuevaReserva.fecha.toISOString().split('T')[1]?.split('.')[0] || "00:00",
      estado: "confirmada",
      monto: vehiculo.precio,
      moneda: "USD",
      accionesDisponibles: ["cancelar", "ver_detalles"]
    };
    
    return { reserva: nuevaReserva, reservaClienteView };

  } catch (error) {
    // Si es un error de validación que ya se logueó, re-throw
    if (error instanceof Error) {
      throw error;
    }
    
    // Error inesperado
    LogsService.logErrorValidacion(
      data.clienteId || "desconocido",
      "Error inesperado al crear reserva",
      []
    );
    throw new Error("Error inesperado al crear reserva");
  }
};

export const listarReservasAdmin = async (): Promise<ReservaResponse[]> => {
  return prisma.reserva.findMany({
    include: {
      cliente: true,
      vehiculo: true
    }
  })
};

export const listarReservasCliente = async (clienteId: string): Promise<ReservaResponse[]> => {
  return prisma.reserva.findMany({
    where: { clienteId },
    include: {
      vehiculo: true
    }
  })
};

export const cancelarReserva = async (id: number, actorTipo: "CLIENTE" | "ADMIN" = "CLIENTE", actorId: string = "sistema", actorNombre: string = "Sistema"): Promise<ReservaResponse> => {
  // Verificar que la reserva existe
  const reservaExistente = await prisma.reserva.findUnique({
    where: { id },
    include: { vehiculo: true, cliente: true }
  });
  
  if (!reservaExistente) {
    throw new Error("Reserva no encontrada");
  }
  
  // Usar transacción para actualizar reserva y vehículo
  const [reservaActualizada] = await prisma.$transaction([
    prisma.reserva.update({
      where: { id },
      data: { estado: "Cancelada" }
    }),
    prisma.vehiculo.update({
      where: { id: reservaExistente.vehiculoId },
      data: { estado: "Disponible" }
    })
  ]);

  // Crear log de cancelación
  LogsService.logCancelarReserva(
    actorTipo,
    actorId,
    actorNombre,
    id.toString(),
    reservaExistente.clienteId,
    "Cancelación solicitada por el usuario"
  );
  
  return reservaActualizada;
};

export const eliminarReserva = async (id: number): Promise<ReservaResponse> => {
  // Verificar que la reserva existe antes de eliminar
  const reservaExistente = await prisma.reserva.findUnique({
    where: { id },
    include: { vehiculo: true }
  });
  
  if (!reservaExistente) {
    throw new Error("Reserva no encontrada");
  }
  
  // Usar transacción para eliminar reserva y liberar vehículo si estaba reservado
  const [reservaEliminada] = await prisma.$transaction([
    prisma.reserva.delete({
      where: { id }
    }),
    ...(reservaExistente.estado === "Activa" ? [
      prisma.vehiculo.update({
        where: { id: reservaExistente.vehiculoId },
        data: { estado: "Disponible" }
      })
    ] : [])
  ]);
  
  return reservaEliminada;
};