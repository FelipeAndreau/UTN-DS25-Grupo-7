// src/types/clientes.types.ts
import { Cliente } from "@prisma/client";

export type CreateClienteRequest = Omit<Cliente, "id" | "creadoEn" | "actualizadoEn">;

export type UpdateClienteRequest = Partial<CreateClienteRequest>

export type ClienteResponse = Omit<Cliente, "creadoEn" | "actualizadoEn">;