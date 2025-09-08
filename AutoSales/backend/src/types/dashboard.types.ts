// src/types/dashboard.ts

export interface DashboardResponse {
    totalClientes: number;
    totalVehiculos: number;
    ventasMensuales: number[];
    clientesPorEstado: Record<string, number>;
    vehiculosPorEstado: Record<string, number>;
}