// src/services/vehiculos.service.ts
import { getVehiculos, createVehiculo, updateVehiculo, deleteVehiculo, } from "../models/vehiculos.model";

import { VehiculoRequest } from "../types/vehiculos.types";

export const listarVehiculos = async () => {
  return await getVehiculos();
};

export const registrarVehiculo = async (data: VehiculoRequest) => {
  await createVehiculo(data);
};

export const editarVehiculo = async (id: number, data: VehiculoRequest) => {
  await updateVehiculo(id, data);
};

export const eliminarVehiculo = async (id: number) => {
  await deleteVehiculo(id);
};