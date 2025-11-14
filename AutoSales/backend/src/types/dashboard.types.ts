// src/types/dashboard.ts

export interface DashboardResponse {
    totalClientes: number;
    totalVehiculos: number;
    totalVentas: number;
    ventasMensuales: number[];
    clientesPorEstado: Record<string, number>;
    vehiculosPorEstado: Record<string, number>;
}