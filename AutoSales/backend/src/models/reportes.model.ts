// src/models/reportes.model.ts
import prisma from "../config/prisma";
import { ReporteResponse } from "../types/reportes.types";

export const getReporteVentas = async (mes: string): Promise<ReporteResponse> => {
  const mesNumero = parseInt(mes);
  
  const ventas = await prisma.venta.findMany({
    where: {
      fecha: {
        gte: new Date(new Date().getFullYear(), mesNumero - 1, 1),
        lt: new Date(new Date().getFullYear(), mesNumero, 1)
      }
    },
    select: {
      fecha: true,
      monto: true
    }
  });

  const total = ventas.length;
  
  // Agrupar por día
  const ventasPorDia: Record<number, number> = {};
  ventas.forEach(venta => {
    const dia = venta.fecha.getDate();
    ventasPorDia[dia] = (ventasPorDia[dia] || 0) + venta.monto;
  });

  const grafico = Object.values(ventasPorDia);

  return {
    mes,
    tipo: "ventas",
    total,
    grafico,
  };
};

export const getReporteClientes = async (mes: string): Promise<ReporteResponse> => {
  const mesNumero = parseInt(mes);
  
  const clientes = await prisma.cliente.findMany({
    where: {
      creadoEn: {
        gte: new Date(new Date().getFullYear(), mesNumero - 1, 1),
        lt: new Date(new Date().getFullYear(), mesNumero, 1)
      }
    },
    select: {
      creadoEn: true
    }
  });

  const total = clientes.length;
  
  // Agrupar por día
  const clientesPorDia: Record<number, number> = {};
  clientes.forEach(cliente => {
    const dia = cliente.creadoEn.getDate();
    clientesPorDia[dia] = (clientesPorDia[dia] || 0) + 1;
  });

  const grafico = Object.values(clientesPorDia);

  return {
    mes,
    tipo: "clientes",
    total,
    grafico,
  };
};

export const getReporteVehiculos = async (mes: string): Promise<ReporteResponse> => {
  const mesNumero = parseInt(mes);
  
  const vehiculos = await prisma.vehiculo.findMany({
    where: {
      estado: 'Vendido',
      actualizadoEn: {
        gte: new Date(new Date().getFullYear(), mesNumero - 1, 1),
        lt: new Date(new Date().getFullYear(), mesNumero, 1)
      }
    },
    select: {
      actualizadoEn: true
    }
  });

  const total = vehiculos.length;
  
  // Agrupar por día
  const vehiculosPorDia: Record<number, number> = {};
  vehiculos.forEach(vehiculo => {
    const dia = vehiculo.actualizadoEn.getDate();
    vehiculosPorDia[dia] = (vehiculosPorDia[dia] || 0) + 1;
  });

  const grafico = Object.values(vehiculosPorDia);

  return {
    mes,
    tipo: "vehiculos",
    total,
    grafico,
  };
};