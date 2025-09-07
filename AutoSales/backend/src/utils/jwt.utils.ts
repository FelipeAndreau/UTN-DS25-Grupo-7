// src/utils/jwt.utils.ts
import jwt from "jsonwebtoken";

export const generateToken = (payload: { id: string; email: string; rol: string }) => {
  const secret = process.env.JWT_SECRET || "tu-secret-key";
  return jwt.sign(payload, secret, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  const secret = process.env.JWT_SECRET || "tu-secret-key";
  return jwt.verify(token, secret);
};