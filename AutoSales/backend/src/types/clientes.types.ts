// src/types/clientes.types.ts
export interface Cliente {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
    tipo: "Particular" | "Empresa";
    estado: "Activo" | "En proceso" | "Financiamiento" | "Potencial";
    actividad: string;
}

export type ClienteRequest = Omit<Cliente, "id">;

export type ClienteResponse = Cliente[];