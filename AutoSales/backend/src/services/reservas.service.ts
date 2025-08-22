// src/services/reservas.service.ts
import prisma from "../config/prisma"
import { CrearReservaDTO, ReservaResponse } from "../types/reservas.types"

export const crearReserva = async (data: CrearReservaDTO): Promise<ReservaResponse> => {
  return prisma.reserva.create({
    data: {
      clienteId: data.clienteId,
      vehiculoId: data.vehiculoId
    }
  })
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

export const cancelarReserva = async (id: number): Promise<ReservaResponse> => {
  return prisma.reserva.update({
    where: { id },
    data: { estado: "Cancelada" }
  })
};