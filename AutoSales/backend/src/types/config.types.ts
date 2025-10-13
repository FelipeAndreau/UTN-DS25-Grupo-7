// src/types/config.ts

export interface Configuracion {
    id: number;
    usuarioId: string;
    tema: string;
    idioma: string;
    notificaciones: boolean;
    creadoEn: Date;
    actualizadoEn: Date;
}

export type ConfigResponse = Omit<Configuracion, "id" | "usuarioId" | "creadoEn" | "actualizadoEn">;


export type UpdateConfigRequest = Partial<ConfigResponse>;