// src/types/config.ts
import { Configuracion } from "@prisma/client";

export type ConfigResponse = Omit<Configuracion, "id" | "usuarioId" | "creadoEn" | "actualizadoEn">;


export type UpdateConfigRequest = Partial<ConfigResponse>;