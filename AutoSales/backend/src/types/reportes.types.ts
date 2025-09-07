// src/types/reportes.types.ts
export interface ReporteResponse {
    mes: string;
    tipo: "ventas" | "clientes" | "vehiculos";
    total: number;
    grafico: number[];
}