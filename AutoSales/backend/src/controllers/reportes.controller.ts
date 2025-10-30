// src/controllers/reportes.controller.ts

import { Request, Response } from "express";
import {
  reporteVentas,
  reporteClientes,
  reporteVehiculos,
} from "../services/reportes.service";

export const getVentas = async (req: Request, res: Response) => {
  const mes = req.query.mes as string;
  const data = await reporteVentas(mes);
  res.json(data);
};

export const getClientes = async (req: Request, res: Response) => {
  const mes = req.query.mes as string;
  const data = await reporteClientes(mes);
  res.json(data);
};

export const getVehiculos = async (req: Request, res: Response) => {
  const mes = req.query.mes as string;
  const data = await reporteVehiculos(mes);
  res.json(data);
};