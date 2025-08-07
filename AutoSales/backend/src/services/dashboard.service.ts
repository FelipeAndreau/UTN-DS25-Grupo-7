// src/services/dashboard.service.ts
import {
  contarClientes,
  contarVehiculos,
  obtenerVentasMensuales,
  agruparClientesPorEstado,
  agruparVehiculosPorEstado,
} from "../models/dashboard.model";

import { DashboardResponse } from "../types/dashboard.types";

export const obtenerDashboardStats = async (): Promise<DashboardResponse> => {
  const totalClientes = await contarClientes();
  const totalVehiculos = await contarVehiculos();
  const ventasMensuales = await obtenerVentasMensuales();
  const clientesPorEstado = await agruparClientesPorEstado();
  const vehiculosPorEstado = await agruparVehiculosPorEstado();

  return {
    totalClientes,
    totalVehiculos,
    ventasMensuales,
    clientesPorEstado,
    vehiculosPorEstado,
  };
};