// src/services/usuarios.service.ts
import { getUsuarios, createUsuario, updateUsuario, softDeleteUsuario, } from "../models/usuarios.model";

import { UsuarioRequest } from "../types/usuarios.types";

export const listarUsuarios = async () => {
  return await getUsuarios();
};

export const registrarUsuario = async (data: UsuarioRequest) => {
  await createUsuario(data);
};

export const editarUsuario = async (id: string, data: UsuarioRequest) => {
  await updateUsuario(id, data);
};

export const eliminarUsuario = async (id: string) => {
  await softDeleteUsuario(id);
};