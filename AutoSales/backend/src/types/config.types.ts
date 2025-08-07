// src/types/config.ts
export interface Config {
    idioma: string;
    tema: "claro" | "oscuro";
    notificaciones: boolean;
}

export interface ConfigResponse extends Config {}

export type ConfigRequest = Partial<Config>; // Permite actualizar solo algunos campos