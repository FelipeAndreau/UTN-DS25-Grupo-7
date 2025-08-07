// src/models/usuarios.model.ts
import { pool } from "../db";
import { Usuario, UsuarioRequest } from "../types/usuarios.types";

export const getUsuarios = async (): Promise<Usuario[]> => {
  const result = await pool.query("SELECT * FROM usuarios WHERE eliminado IS NOT TRUE");
  return result.rows;
};

export const createUsuario = async (data: UsuarioRequest): Promise<void> => {
  const query = `
    INSERT INTO usuarios (nombre, email, rol)
    VALUES ($1, $2, $3)
  `;
  const values = [data.nombre, data.email, data.rol];
  await pool.query(query, values);
};

export const updateUsuario = async (id: string, data: UsuarioRequest): Promise<void> => {
  const query = `
    UPDATE usuarios SET nombre=$1, email=$2, rol=$3
    WHERE id=$4
  `;
  const values = [data.nombre, data.email, data.rol, id];
  await pool.query(query, values);
};

export const softDeleteUsuario = async (id: string): Promise<void> => {
  await pool.query("UPDATE usuarios SET eliminado = TRUE WHERE id = $1", [id]);
};