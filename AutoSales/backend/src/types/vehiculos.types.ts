// src/types/vehiculos.types.ts
export interface Vehiculo {
    id: number;
    marca: string;
    modelo: string;
    anio: number;
    precio: number;
    estado: "Disponible" | "Reservado" | "Vendido";
    imagen: string;
    descripcion: string;
}

export type VehiculoRequest = Omit<Vehiculo, "id">;

export type VehiculoResponse = Vehiculo[];