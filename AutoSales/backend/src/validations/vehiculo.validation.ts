// src/validations/vehiculo.validation.ts

import { z } from 'zod';
import { EstadoVehiculo } from '@prisma/client';

export const createVehiculoSchema = z.object({
  marca: z.string().min(1, 'La marca es requerida').max(100).trim(),
  modelo: z.string().min(1, 'El modelo es requerido').max(100).trim(),
  anio: z.coerce.number().int().min(1900, 'Año inválido').max(new Date().getFullYear()),
  precio: z.coerce.number().positive('El precio debe ser positivo'),
  estado: z.nativeEnum(EstadoVehiculo),
  imagen: z.string().min(1, 'La imagen es requerida').max(1000000), // Allow large strings for base64
  descripcion: z.string().min(1, 'La descripción es requerida').max(300).trim()
});

export const updateVehiculoSchema = createVehiculoSchema.partial();
