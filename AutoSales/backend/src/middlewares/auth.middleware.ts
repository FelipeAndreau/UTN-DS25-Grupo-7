// src/middlewares/auth.middleware.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("🔐 AuthMiddleware - Headers:", req.headers.authorization ? "✅ Authorization header present" : "❌ No Authorization header");
    
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      console.log("❌ No token found");
      return res.status(401).json({
        success: false,
        message: "Token de acceso requerido"
      });
    }

    console.log("🔍 Token found, verifying...");
    const secret = process.env.JWT_SECRET || "tu-secret-key";
    const decoded = jwt.verify(token, secret) as any;
    
    req.user = {
      id: decoded.id,
      email: decoded.email,
      rol: decoded.rol
    };
    
    console.log("✅ User authenticated:", { id: decoded.id, email: decoded.email, rol: decoded.rol });
    next();
  } catch (error) {
    console.log("❌ Token verification failed:", error);
    res.status(401).json({
      success: false,
      message: "Token inválido"
    });
  }
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Acceso no autorizado"
    });
  }

  if (req.user.rol !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Acceso denegado - Se requieren permisos de administrador"
    });
  }

  next();
};