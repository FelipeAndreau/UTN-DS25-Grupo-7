// src/controllers/vehiculos.controller.ts
import { Request, Response } from "express";
import {
  listarVehiculos,
  registrarVehiculo,
  editarVehiculo,
  eliminarVehiculo,
} from "../services/vehiculos.service";

export const getVehiculos = async (_: Request, res: Response) => {
  const vehiculos = await listarVehiculos();
  res.json(vehiculos);
};

export const postVehiculo = async (req: Request, res: Response) => {
  await registrarVehiculo(req.body);
  res.status(201).json({ message: "Vehículo creado" });
};

export const putVehiculo = async (req: Request, res: Response) => {
  await editarVehiculo(Number(req.params.id), req.body);
  res.json({ message: "Vehículo actualizado" });
};

export const deleteVehiculo = async (req: Request, res: Response) => {
  await eliminarVehiculo(Number(req.params.id));
  res.json({ message: "Vehículo eliminado" });
};