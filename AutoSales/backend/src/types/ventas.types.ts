export interface Venta {
    id: number;
    clienteId: string;
    vehiculoId: number;
    fecha: Date;
    monto: number;
    creadoEn: Date;
    actualizadoEn: Date;
}

export type CreateVentaRequest = Omit<Venta, "id" | "creadoEn" | "actualizadoEn" | "fecha"> & { fecha?: Date };

export type UpdateVentaRequest = Partial<CreateVentaRequest>;

export type VentaResponse = Omit<Venta, "creadoEn" | "actualizadoEn">;