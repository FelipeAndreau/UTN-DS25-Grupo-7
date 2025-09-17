// src/services/auth.service.ts
import bcrypt from "bcrypt";
import prisma from "../config/prisma";
import { generateToken } from "../utils/jwt";
import { LoginResponse } from "../types/auth.types";

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  console.log("🔍 Intentando login para:", email);
  
  // Buscar usuario en la base de datos
  const user = await prisma.usuario.findUnique({
    where: { email },
  });

  console.log("👤 Usuario encontrado:", user ? "Sí" : "No");
  
  if (!user || !user.activo) {
    console.log("❌ Usuario no encontrado o inactivo");
    throw new Error("Credenciales inválidas");
  }

  // Verificar contraseña (encriptada o temporal "admin123")
  const passwordMatch = password === "admin123" || await bcrypt.compare(password, user.password);
  
  console.log("🔐 Password match:", passwordMatch);
  
  if (!passwordMatch) {
    console.log("❌ Contraseña incorrecta");
    throw new Error("Credenciales inválidas");
  }

  console.log("✅ Login exitoso para usuario:", user.nombre);

  const token = generateToken({
    id: user.id,
    rol: user.rol,
    email: user.email,
  });

  return {
    token,
    user: {
      id: user.id,
      rol: user.rol as "admin" | "viewer",
      nombre: user.nombre,
    },
  };
};