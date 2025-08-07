// src/models/user.model.ts
import { pool } from "../db";
import bcrypt from "bcrypt";

export interface User {
  id: string;
  nombre: string;
  email: string;
  password: string;
  rol: "admin" | "vendedor" | "viewer";
}

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
  return result.rows[0] || null;
};

export const validatePassword = (input: string, hash: string): boolean => {
  return bcrypt.compareSync(input, hash);
};