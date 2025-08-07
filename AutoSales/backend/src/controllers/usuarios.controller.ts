// src/controllers/usuarios.controller.ts
import { Request, Response } from "express";
import {
  listarUsuarios,
  registrarUsuario,
  editarUsuario,
  eliminarUsuario,
} from "../services/usuarios.service";

export const getUsuarios = async (_: Request, res: Response) => {
  const usuarios = await listarUsuarios();
  res.json(usuarios);
};

export const postUsuario = async (req: Request, res: Response) => {
  await registrarUsuario(req.body);
  res.status(201).json({ message: "Usuario creado" });
};

export const putUsuario = async (req: Request, res: Response) => {
  await editarUsuario(req.params.id, req.body);
  res.json({ message: "Usuario actualizado" });
};

export const deleteUsuario = async (req: Request, res: Response) => {
  await eliminarUsuario(req.params.id);
  res.json({ message: "Usuario eliminado" });
};