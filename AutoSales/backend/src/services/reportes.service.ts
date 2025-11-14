// src/services/reportes.service.ts

import { getReporteVentas, getReporteClientes, getReporteVehiculos, } from "../models/reportes.model";

export const reporteVentas = async (mes: string) => await getReporteVentas(mes);

export const reporteClientes = async (mes: string) => await getReporteClientes(mes);

export const reporteVehiculos = async (mes: string) => await getReporteVehiculos(mes);