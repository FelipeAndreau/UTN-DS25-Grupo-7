// src/types/reservas.types.ts

export interface CrearReservaDTO {
    clienteId?: string
    vehiculoId: number
    fechaVisita?: string // Fecha de visita opcional
}

export interface ReservaResponse {
    id: number
    clienteId: string
    vehiculoId: number
    fecha: Date
    fechaVisita?: Date | null // Fecha de visita opcional
    estado: string
    vehiculo?: {
        id: number
        marca: string
        modelo: string
        anio: number
        precio: number
        estado: string
        imagen?: string
    }
    cliente?: {
        id: string
        nombre: string
        email: string
        telefono: string
    }
}