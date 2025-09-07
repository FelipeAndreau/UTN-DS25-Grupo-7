// src/validations/venta.validation.ts

import { z } from 'zod';

export const createVentaSchema = z.object({
  clienteId: z.string()
  .trim()
  .min(1, { message: 'El ID de cliente es requerido' })
  .refine(val => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val), {
    message: 'ID de cliente inválido'
  }),
  vehiculoId: z.number()
    .int('ID de vehículo inválido')
    .positive(),
  fecha: z.coerce.date().optional(),
  monto: z.number()
    .positive('El monto debe ser positivo')
});

export const updateVentaSchema = createVentaSchema.partial();
