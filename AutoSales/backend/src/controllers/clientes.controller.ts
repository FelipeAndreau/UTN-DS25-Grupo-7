// src/controllers/clientes.controller.ts
import { Request, Response } from "express";
import {
  listarClientes,
  registrarCliente,
  editarCliente,
  eliminarCliente,
} from "../services/clientes.service"

export const getClientes = async (_: Request, res: Response) => {
  const clientes = await listarClientes();
  res.json(clientes);
};

export const postCliente = async (req: Request, res: Response) => {
  await registrarCliente(req.body);
  res.status(201).json({ message: "Cliente creado" });
};

export const putCliente = async (req: Request, res: Response) => {
  await editarCliente(req.params.id, req.body);
  res.json({ message: "Cliente actualizado" });
};

export const deleteCliente = async (req: Request, res: Response) => {
  await eliminarCliente(req.params.id);
  res.json({ message: "Cliente eliminado" });
};