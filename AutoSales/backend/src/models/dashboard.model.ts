// src/models/dashboard.model.ts
import { pool } from "../db";

export const contarClientes = async (): Promise<number> => {
  const res = await pool.query("SELECT COUNT(*) FROM clientes");
  return parseInt(res.rows[0].count);
};

export const contarVehiculos = async (): Promise<number> => {
  const res = await pool.query("SELECT COUNT(*) FROM vehiculos");
  return parseInt(res.rows[0].count);
};

export const obtenerVentasMensuales = async (): Promise<number[]> => {
  const res = await pool.query(`
    SELECT EXTRACT(MONTH FROM fecha) AS mes, COUNT(*) AS total
    FROM ventas
    WHERE fecha >= NOW() - INTERVAL '12 months'
    GROUP BY mes
    ORDER BY mes
  `);

  const ventasMensuales: number[] = Array(12).fill(0);
  res.rows.forEach((row: any) => {
    const mes = parseInt(row.mes) - 1;
    ventasMensuales[mes] = parseInt(row.total);
  });

  return ventasMensuales;
};

export const agruparClientesPorEstado = async (): Promise<Record<string, number>> => {
  const res = await pool.query(`
    SELECT estado, COUNT(*) AS total
    FROM clientes
    GROUP BY estado
  `);

  const resultado: Record<string, number> = {};
  res.rows.forEach((row: any) => {
    resultado[row.estado] = parseInt(row.total);
  });

  return resultado;
};

export const agruparVehiculosPorEstado = async (): Promise<Record<string, number>> => {
  const res = await pool.query(`
    SELECT estado, COUNT(*) AS total
    FROM vehiculos
    GROUP BY estado
  `);

  const resultado: Record<string, number> = {};
  res.rows.forEach((row: any) => {
    resultado[row.estado] = parseInt(row.total);
  });

  return resultado;
};