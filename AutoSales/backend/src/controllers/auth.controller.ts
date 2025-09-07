// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import { loginUser } from "../services/auth.service";
import { LoginResponse } from "../types/auth.types";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Validación de entrada
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email y contraseña son requeridos" 
      });
    }

    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: "Formato de email inválido" 
      });
    }
    
    const result: LoginResponse = await loginUser(email, password);
    
    res.json({
      success: true,
      message: "Login exitoso",
      ...result
    });
  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(401).json({ 
      success: false, 
      message: "Credenciales inválidas" 
    });
  }
};