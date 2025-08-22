import { Venta } from "../generated/prisma";

export type CreateVentaRequest = Omit<Venta, "id" | "creadoEn" | "actualizadoEn" | "fecha"> & { fecha?: Date };

export type UpdateVentaRequest = Partial<CreateVentaRequest>;

export type VentaResponse = Omit<Venta, "creadoEn" | "actualizadoEn">;