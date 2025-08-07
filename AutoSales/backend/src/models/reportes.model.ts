// src/models/reportes.model.ts
import { pool } from "../db";
import { ReporteResponse } from "../types/reportes.types";

export const getReporteVentas = async (mes: string): Promise<ReporteResponse> => {
  const result = await pool.query(
    "SELECT COUNT(*) AS total FROM ventas WHERE EXTRACT(MONTH FROM fecha) = $1",
    [mes]
  );
  const grafico = await pool.query(
    "SELECT dia, SUM(monto) FROM ventas WHERE EXTRACT(MONTH FROM fecha) = $1 GROUP BY dia ORDER BY dia",
    [mes]
  );
  return {
    mes,
    tipo: "ventas",
    total: parseInt(result.rows[0].total),
    grafico: grafico.rows.map((r) => r.sum),
  };
};

export const getReporteClientes = async (mes: string): Promise<ReporteResponse> => {
  const result = await pool.query(
    "SELECT COUNT(*) AS total FROM clientes WHERE EXTRACT(MONTH FROM fecha_registro) = $1",
    [mes]
  );
  const grafico = await pool.query(
    "SELECT dia, COUNT(*) FROM clientes WHERE EXTRACT(MONTH FROM fecha_registro) = $1 GROUP BY dia ORDER BY dia",
    [mes]
  );
  return {
    mes,
    tipo: "clientes",
    total: parseInt(result.rows[0].total),
    grafico: grafico.rows.map((r) => r.count),
  };
};

export const getReporteVehiculos = async (mes: string): Promise<ReporteResponse> => {
  const result = await pool.query(
    "SELECT COUNT(*) AS total FROM vehiculos WHERE estado = 'Vendido' AND EXTRACT(MONTH FROM fecha_venta) = $1",
    [mes]
  );
  const grafico = await pool.query(
    "SELECT dia, COUNT(*) FROM vehiculos WHERE estado = 'Vendido' AND EXTRACT(MONTH FROM fecha_venta) = $1 GROUP BY dia ORDER BY dia",
    [mes]
  );
  return {
    mes,
    tipo: "vehiculos",
    total: parseInt(result.rows[0].total),
    grafico: grafico.rows.map((r) => r.count),
  };
};