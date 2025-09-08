// src/types/venta.types.ts

import { Venta } from "@prisma/client";

export type CreateVentaRequest = Omit<Venta, "id" | "creadoEn" | "actualizadoEn" | "fecha"> & { fecha?: Date };

export type UpdateVentaRequest = Partial<CreateVentaRequest>;

export type VentaResponse = Omit<Venta, "creadoEn" | "actualizadoEn">;