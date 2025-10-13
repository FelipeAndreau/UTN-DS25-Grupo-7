// src/types/clientes.types.ts

export interface Cliente {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
    tipo: string;
    estado: string;
    activo: boolean;
    creadoEn: Date;
    actualizadoEn: Date;
}

export type CreateClienteRequest = Omit<Cliente, "id" | "creadoEn" | "actualizadoEn">;

export type UpdateClienteRequest = Partial<CreateClienteRequest>

export type ClienteResponse = Omit<Cliente, "creadoEn" | "actualizadoEn">;