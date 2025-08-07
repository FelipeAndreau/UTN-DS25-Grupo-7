// src/models/clientes.model.ts
import { pool } from "../db";
import { Cliente, ClienteRequest } from "../types/clientes.types";

export const getClientes = async (): Promise<Cliente[]> => {
  const result = await pool.query("SELECT * FROM clientes");
  return result.rows;
};

export const createCliente = async (data: ClienteRequest): Promise<void> => {
  const query = `
    INSERT INTO clientes (nombre, email, telefono, tipo, estado, actividad)
    VALUES ($1, $2, $3, $4, $5, $6)
  `;
  const values = [data.nombre, data.email, data.telefono, data.tipo, data.estado, data.actividad];
  await pool.query(query, values);
};

export const updateCliente = async (id: string, data: ClienteRequest): Promise<void> => {
  const query = `
    UPDATE clientes SET nombre=$1, email=$2, telefono=$3, tipo=$4, estado=$5, actividad=$6
    WHERE id=$7
  `;
  const values = [data.nombre, data.email, data.telefono, data.tipo, data.estado, data.actividad, id];
  await pool.query(query, values);
};

export const deleteCliente = async (id: string): Promise<void> => {
  await pool.query("DELETE FROM clientes WHERE id = $1", [id]);
};