// src/models/dashboard.model.ts
import prisma from "../config/prisma";

export const contarClientes = async (): Promise<number> => {
  const count = await prisma.cliente.count();
  return count;
};

export const contarVehiculos = async (): Promise<number> => {
  const count = await prisma.vehiculo.count();
  return count;
};

export const obtenerVentasMensuales = async (): Promise<number[]> => {
  const doceMonthsAgo = new Date();
  doceMonthsAgo.setMonth(doceMonthsAgo.getMonth() - 12);

  const ventas = await prisma.venta.findMany({
    where: {
      fecha: {
        gte: doceMonthsAgo
      }
    },
    select: {
      fecha: true
    }
  });

  const ventasMensuales: number[] = Array(12).fill(0);
  ventas.forEach((venta) => {
    const mes = venta.fecha.getMonth();
    ventasMensuales[mes]++;
  });

  return ventasMensuales;
};

export const agruparClientesPorEstado = async (): Promise<Record<string, number>> => {
  const clientes = await prisma.cliente.groupBy({
    by: ['estado'],
    _count: {
      estado: true
    }
  });

  const resultado: Record<string, number> = {};
  clientes.forEach((cliente) => {
    resultado[cliente.estado] = cliente._count.estado;
  });

  return resultado;
};

export const agruparVehiculosPorEstado = async (): Promise<Record<string, number>> => {
  const vehiculos = await prisma.vehiculo.groupBy({
    by: ['estado'],
    _count: {
      estado: true
    }
  });

  const resultado: Record<string, number> = {};
  vehiculos.forEach((vehiculo) => {
    resultado[vehiculo.estado] = vehiculo._count.estado;
  });

  return resultado;
};