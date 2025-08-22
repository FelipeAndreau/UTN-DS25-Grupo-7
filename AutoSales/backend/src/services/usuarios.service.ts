// src/services/usuarios.service.ts
import prisma from "@/config/prisma";
import { UsuarioRequest, UsuarioAdminDTO } from "../types/usuarios.types";
import bcrypt from "bcrypt";

export const listarUsuarios = async (): Promise<UsuarioAdminDTO[]> => {
  return await prisma.usuario.findMany({
    select: {
      id: true,
      nombre: true,
      email: true,
      rol: true,
      activo: true,
    },
  });
};

export const registrarUsuario = async (data: UsuarioRequest) => {
  await prisma.usuario.create({
    data: {
      nombre: data.nombre,
      email: data.email,
      password: bcrypt.hashSync(data.password, 10),
      rol: data.rol,
    },
  });
};

export const editarUsuario = async (id: string, data: UsuarioRequest) => {
  await prisma.usuario.update({
    where: { id },
    data: {
      nombre: data.nombre,
      email: data.email,
      password: bcrypt.hashSync(data.password, 10),
      rol: data.rol,
    },
  });
};

export const eliminarUsuario = async (id: string) => {
  await prisma.usuario.update({
    where: { id },
    data: { activo: false },
  });
};