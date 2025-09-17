// src/middlewares/validation.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema, ZodError } from 'zod';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validar y parsear el body de la request
      const validatedData = schema.parse(req.body);
      
      // Reemplazar req.body con los datos validados
      req.body = validatedData;
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Formatear errores de Zod de manera amigable
        const formattedErrors = error.issues.map((err: any) => ({
          campo: err.path.join('.'),
          mensaje: err.message,
          valorRecibido: err.received
        }));

        console.error('❌ Error de validación:', formattedErrors);
        
        return res.status(400).json({
          success: false,
          message: 'Errores de validación',
          errors: formattedErrors
        });
      }
      
      // Error inesperado
      console.error('❌ Error inesperado en validación:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.query);
      (req.query as any) = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err: any) => ({
          campo: err.path.join('.'),
          mensaje: err.message,
          valorRecibido: err.received
        }));

        console.error('❌ Error de validación en query:', formattedErrors);
        
        return res.status(400).json({
          success: false,
          message: 'Errores de validación en parámetros',
          errors: formattedErrors
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.params);
      (req.params as any) = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err: any) => ({
          campo: err.path.join('.'),
          mensaje: err.message,
          valorRecibido: err.received
        }));

        console.error('❌ Error de validación en params:', formattedErrors);
        
        return res.status(400).json({
          success: false,
          message: 'Errores de validación en parámetros de ruta',
          errors: formattedErrors
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };
};
