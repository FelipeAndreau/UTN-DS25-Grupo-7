// src/models/dashboard.model.ts
import prisma from "../config/prisma";

export const contarClientes = async (): Promise<number> => {
  try {
    const count = await prisma.cliente.count();
    return count;
  } catch (error) {
    console.error("Error contando clientes:", error);
    return 0;
  }
};

export const contarVehiculos = async (): Promise<number> => {
  try {
    const count = await prisma.vehiculo.count();
    return count;
  } catch (error) {
    console.error("Error contando vehículos:", error);
    return 0;
  }
};

export const obtenerVentasMensuales = async (): Promise<number[]> => {
  try {
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
  } catch (error) {
    console.error("Error obteniendo ventas mensuales:", error);
    return Array(12).fill(0);
  }
};

export const agruparClientesPorEstado = async (): Promise<Record<string, number>> => {
  try {
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
  } catch (error) {
    console.error("Error agrupando clientes por estado:", error);
    return {};
  }
};

export const agruparVehiculosPorEstado = async (): Promise<Record<string, number>> => {
  try {
    const vehiculos = await prisma.vehiculo.groupBy({
      by: ['estado'],
      _count: {
        estado: true
      }
    });

    const resultado: Record<string, number> = {};
    vehiculos.forEach((vehiculo: any) => {
      resultado[vehiculo.estado] = vehiculo._count.estado;
    });

    return resultado;
  } catch (error) {
    console.error("Error agrupando vehículos por estado:", error);
    return {};
  }
};

export const contarVentas = async (): Promise<number> => {
  try {
    const count = await prisma.venta.count();
    return count;
  } catch (error) {
    console.error("Error contando ventas:", error);
    return 0;
  }
};