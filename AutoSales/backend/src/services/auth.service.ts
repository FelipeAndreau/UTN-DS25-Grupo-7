// src/services/auth.service.ts
import bcrypt from "bcrypt";
import prisma from "@/config/prisma";
import { generateToken } from "../utils/jwt";
import { LoginResponse } from "../types/auth.types";

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const user = await prisma.usuario.findUnique({
    where: { email },
  });

  if (!user || !user.activo || !bcrypt.compareSync(password, user.password)) {
    throw new Error("Credenciales inválidas");
  }

  const token = generateToken({ id: user.id, rol: user.rol });

  return {
    token,
    user: {
      id: user.id,
      rol: user.rol,
      nombre: user.nombre,
    },
  };
};