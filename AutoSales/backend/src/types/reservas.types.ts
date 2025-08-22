// src/types/reservas.types.ts
export interface CrearReservaDTO {
    clienteId: string
    vehiculoId: number
}

export interface ReservaResponse {
    id: number
    clienteId: string
    vehiculoId: number
    fecha: Date
    estado: string
}