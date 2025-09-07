import { z } from "zod";

export const usuarioSchema = z.object({
    nombre: z
    .string({
        required_error: "El nombre es obligatorio",
        invalid_type_error: "Debe ser un texto",
    })
    .min(2, "Debe tener al menos 2 caracteres"),

    email: z
    .string({
        required_error: "El email es obligatorio",
        invalid_type_error: "Debe ser un texto",
    })
    .email("Debe ser un email válido"),

    password: z
    .string({
        required_error: "La contraseña es obligatoria",
        invalid_type_error: "Debe ser un texto",
    })
    .min(8, "Debe tener al menos 8 caracteres"),

    rol: z.enum(["admin", "viewer", "cliente"], {
        errorMap: () => ({ message: "Rol inválido" }),
    }),
});

export const usuarioUpdateSchema = usuarioSchema.partial();