// src/validations/vehiculo.validation.ts

import { z } from 'zod';

enum EstadoVehiculo {
  disponible = "disponible",
  vendido = "vendido", 
  reservado = "reservado"
}

export const createVehiculoSchema = z.object({
  marca: z.string().min(1, 'La marca es requerida').max(100).trim(),
  modelo: z.string().min(1, 'El modelo es requerido').max(100).trim(),
  anio: z.number().int().min(1900, 'Año inválido').max(new Date().getFullYear()),
  precio: z.number().positive('El precio debe ser positivo'),
  estado: z.nativeEnum(EstadoVehiculo),
  imagen: z.string()
  .trim()
  .min(1, { message: 'La imagen es requerida' })
  .refine(val => {
    // Permitir URLs HTTP/HTTPS o datos base64
    const isUrl = /^https?:\/\/.+\..+/.test(val);
    const isBase64 = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/.test(val);
    return isUrl || isBase64;
  }, {
    message: 'Debe ser una URL válida o imagen en base64'
  }),
  descripcion: z.string().min(1, 'La descripción es requerida').max(300).trim()
});

export const updateVehiculoSchema = createVehiculoSchema.partial();
