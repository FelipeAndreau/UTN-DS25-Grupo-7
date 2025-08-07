// src/services/auth.service.ts
import jwt from "jsonwebtoken";
import { getUserByEmail, validatePassword } from "../models/user.model";

export const loginUser = async (email: string, password: string) => {
  const user = await getUserByEmail(email);
  if (!user || !validatePassword(password, user.password)) {
    throw new Error("Credenciales inválidas");
  }

  const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  return {
    token,
    user: {
      id: user.id,
      rol: user.rol,
      nombre: user.nombre,
    },
  };
};