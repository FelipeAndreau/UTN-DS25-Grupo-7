// src/types/vehiculos.types.ts

export interface Vehiculo {
    id: number;
    marca: string;
    modelo: string;
    anio: number;
    precio: number;
    estado: string;
    imagen: string;
    descripcion: string;
    creadoEn: Date;
    actualizadoEn: Date;
}

export type CreateVehiculoRequest = Omit<Vehiculo, "id" | "creadoEn" | "actualizadoEn">;

export type UpdateVehiculoRequest = Partial<CreateVehiculoRequest>;

export type VehiculoResponse = Omit<Vehiculo, "creadoEn" | "actualizadoEn">;