// src/types/vehiculos.types.ts
import { Vehiculo } from "../generated/prisma";

export type CreateVehiculoRequest = Omit<Vehiculo, "id" | "creadoEn" | "actualizadoEn">;

export type UpdateVehiculoRequest = Partial<CreateVehiculoRequest>;

export type VehiculoResponse = Omit<Vehiculo, "creadoEn" | "actualizadoEn">;