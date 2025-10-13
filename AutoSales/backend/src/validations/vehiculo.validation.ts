// src/validations/vehiculo.validation.ts

import { z } from 'zod';
import { EstadoVehiculo } from '@prisma/client';

export const createVehiculoSchema = z.object({
  marca: z.string().min(1, 'La marca es requerida').max(100).trim(),
  modelo: z.string().min(1, 'El modelo es requerido').max(100).trim(),
  anio: z.number().int().min(1900, 'Año inválido').max(new Date().getFullYear()),
  precio: z.number().positive('El precio debe ser positivo'),
  estado: z.nativeEnum(EstadoVehiculo),
  imagen: z.string()
    .trim()
    .min(1, { message: 'La URL de imagen es requerida' })
    .refine(val => /^https?:\/\/.+\..+/.test(val), {
      message: 'URL de imagen inválida'
    }),
  descripcion: z.string().min(1, 'La descripción es requerida').max(300).trim()
});

export const updateVehiculoSchema = createVehiculoSchema.partial();