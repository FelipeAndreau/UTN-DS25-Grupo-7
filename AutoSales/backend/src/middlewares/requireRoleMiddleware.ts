// src/middlewares/requireRoleMiddleware.ts
import { Request, Response, NextFunction } from "express";

export const requireRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user || !roles.includes(req.user.rol)) {
        return res.status(403).json({ message: "No autorizado" });
      }
      next();
    };
};