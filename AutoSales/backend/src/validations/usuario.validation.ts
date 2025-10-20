// src/validations/usuario.validation.ts

import { z } from 'zod';
import { Rol } from '@prisma/client';

export const createUsuarioSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').max(100).trim(),
  email: z.string()
    .trim()
    .min(1, { message: 'El email es requerido' })
    .refine(val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: 'Email inválido'
    }),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  rol: z.enum(Rol)
    .refine(val => Object.values(Rol).includes(val), {
      message: 'Rol inválido'
    }),
  activo: z.boolean().optional()
});

export const updateUsuarioSchema = createUsuarioSchema.partial();