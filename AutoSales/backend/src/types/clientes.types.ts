// src/types/clientes.types.ts
import { Cliente } from "../generated/prisma";

export type CreateClienteRequest = Omit<Cliente, "id" | "creadoEn" | "actualizadoEn">;

export type UpdateClienteRequest = Partial<CreateClienteRequest>

export type ClienteResponse = Omit<Cliente, "creadoEn" | "actualizadoEn">;