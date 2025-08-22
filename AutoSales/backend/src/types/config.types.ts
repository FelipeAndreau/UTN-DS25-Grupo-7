// src/types/config.ts
import { Configuracion } from "../generated/prisma";

export type ConfigResponse = Omit<Configuracion, "id" | "usuarioId" | "creadoEn" | "actualizadoEn">;


export type UpdateConfigRequest = Partial<ConfigResponse>;