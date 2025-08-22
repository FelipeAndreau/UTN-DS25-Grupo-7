import { Request, Response } from "express";
import {
  listarVentas,
  registrarVenta,
  editarVenta,
  eliminarVenta,
} from "../services/ventas.service";

export const getVentas = async (_: Request, res: Response) => {
  const ventas = await listarVentas();
  res.json(ventas);
};

export const postVenta = async (req: Request, res: Response) => {
  await registrarVenta(req.body);
  res.status(201).json({ message: "Venta creada" });
};

export const putVenta = async (req: Request, res: Response) => {
  await editarVenta(Number(req.params.id), req.body);
  res.json({ message: "Venta actualizada" });
};

export const deleteVenta = async (req: Request, res: Response) => {
  await eliminarVenta(Number(req.params.id));
  res.json({ message: "Venta eliminada" });
};