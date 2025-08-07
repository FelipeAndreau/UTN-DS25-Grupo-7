// src/models/vehiculos.model.ts
import { pool } from "../db";
import { Vehiculo, VehiculoRequest } from "../types/vehiculos.types";

export const getVehiculos = async (): Promise<Vehiculo[]> => {
  const result = await pool.query("SELECT * FROM vehiculos");
  return result.rows;
};

export const createVehiculo = async (data: VehiculoRequest): Promise<void> => {
  const query = `
    INSERT INTO vehiculos (marca, modelo, anio, precio, estado, imagen, descripcion)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `;
  const values = [
    data.marca,
    data.modelo,
    data.anio,
    data.precio,
    data.estado,
    data.imagen,
    data.descripcion,
  ];
  await pool.query(query, values);
};

export const updateVehiculo = async (id: number, data: VehiculoRequest): Promise<void> => {
  const query = `
    UPDATE vehiculos SET marca=$1, modelo=$2, anio=$3, precio=$4, estado=$5, imagen=$6, descripcion=$7
    WHERE id=$8
  `;
  const values = [
    data.marca,
    data.modelo,
    data.anio,
    data.precio,
    data.estado,
    data.imagen,
    data.descripcion,
    id,
  ];
  await pool.query(query, values);
};

export const deleteVehiculo = async (id: number): Promise<void> => {
  await pool.query("DELETE FROM vehiculos WHERE id = $1", [id]);
};