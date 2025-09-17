// src/validations/common.validation.ts

import { z } from 'zod';

// Validación para IDs UUID
export const uuidSchema = z.object({
  id: z.string()
    .trim()
    .min(1, { message: 'ID es requerido' })
    .refine(val => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val), {
      message: 'ID inválido'
    })
});

// Validación para IDs numéricos
export const numericIdSchema = z.object({
  id: z.string()
    .trim()
    .min(1, { message: 'ID es requerido' })
    .refine(val => /^\d+$/.test(val), {
      message: 'ID debe ser un número'
    })
    .transform(val => parseInt(val, 10))
});

// Validación para query de paginación
export const paginationSchema = z.object({
  page: z.string()
    .optional()
    .transform(val => val ? parseInt(val, 10) : 1)
    .refine(val => val > 0, { message: 'La página debe ser mayor a 0' }),
  limit: z.string()
    .optional()
    .transform(val => val ? parseInt(val, 10) : 10)
    .refine(val => val > 0 && val <= 100, { message: 'El límite debe estar entre 1 y 100' })
});

// Validación para filtros de fecha
export const dateRangeSchema = z.object({
  fechaInicio: z.string()
    .optional()
    .refine(val => !val || !isNaN(Date.parse(val)), {
      message: 'Fecha de inicio inválida'
    })
    .transform(val => val ? new Date(val) : undefined),
  fechaFin: z.string()
    .optional()
    .refine(val => !val || !isNaN(Date.parse(val)), {
      message: 'Fecha de fin inválida'
    })
    .transform(val => val ? new Date(val) : undefined)
});
