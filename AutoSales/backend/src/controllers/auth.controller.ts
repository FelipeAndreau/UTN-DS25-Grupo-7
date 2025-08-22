// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import { loginUser } from "../services/auth.service";
import { LoginResponse } from "../types/auth.types";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result: LoginResponse = await loginUser(email, password);
    res.json(result);
  } catch {
    res.status(401).json({ message: "Credenciales inválidas" });
  }
};