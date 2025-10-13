// src/validations/cliente.validation.ts

import { z } from 'zod';

enum TipoCliente {
  individual = "individual",
  empresa = "empresa"
}

enum EstadoCliente {
  activo = "activo", 
  inactivo = "inactivo",
  suspendido = "suspendido",
  prospecto = "prospecto"
}

export const createClienteSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').max(100).trim(),
  email: z.string()
  .trim()
  .min(1, { message: 'El email es requerido' })
  .refine(val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: 'Email inválido'
  }),
  telefono: z.string().min(6, 'Teléfono inválido').max(20),
  tipo: z.nativeEnum(TipoCliente),
  estado: z.nativeEnum(EstadoCliente),
  actividad: z.string().min(1, 'La actividad es requerida').max(200).trim(),
  usuarioId: z.string()
  .refine(val => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val), {
    message: 'ID de usuario inválido'
  })
  .optional()
});

export const updateClienteSchema = createClienteSchema.partial();