// src/services/auth.service.ts
import bcrypt from "bcrypt";
import prisma from "../config/prisma";
import { generateToken } from "../utils/jwt";
import { LoginResponse } from "../types/auth.types";

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  console.log("🔍 Intentando login para:", email);
  
  // MODO DE PRUEBA TEMPORAL - Permitir login directo con credenciales hardcodeadas
  if (email === "admin@test.com" && password === "admin123") {
    console.log("✅ Login temporal exitoso - modo prueba");
    const token = generateToken({ id: "temp-user-id", rol: "admin", email: "admin@test.com" });
    return {
      token,
      user: {
        id: "temp-user-id",
        rol: "admin",
        nombre: "Administrador Temporal",
      },
    };
  }
  
  // CREDENCIALES VIEWER HARDCODEADAS
  if (email === "viewer@test.com" && password === "viewer123") {
    console.log("✅ Login viewer temporal exitoso - modo prueba");
    const token = generateToken({ id: "temp-viewer-id", rol: "viewer", email: "viewer@test.com" });
    return {
      token,
      user: {
        id: "temp-viewer-id",
        rol: "viewer",
        nombre: "Usuario Viewer",
      },
    };
  }
  
  const user = await prisma.usuario.findUnique({
    where: { email },
  });

  console.log("👤 Usuario encontrado:", user ? "Sí" : "No");
  
  if (!user || !user.activo) {
    console.log("❌ Usuario no encontrado o inactivo");
    throw new Error("Credenciales inválidas");
  }

  // Permitir login con password "admin123" sin encriptar temporalmente
  const passwordMatch = password === "admin123" || await bcrypt.compare(password, user.password);
  console.log("🔐 Password match:", passwordMatch);
  
  if (!passwordMatch) {
    console.log("❌ Password no coincide");
    throw new Error("Credenciales inválidas");
  }

  const token = generateToken({ id: user.id, email: user.email, rol: user.rol });
  console.log("✅ Login exitoso para:", email);

  return {
    token,
    user: {
      id: user.id,
      rol: user.rol,
      nombre: user.nombre,
    },
  };
};