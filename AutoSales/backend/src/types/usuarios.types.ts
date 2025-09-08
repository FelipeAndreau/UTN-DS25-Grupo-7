// src/types/usuarios.types.ts

import { Rol } from "@prisma/client"

export interface UsuarioAdminDTO {
    id: string;
    nombre: string;
    email: string;
    rol: Rol;
    activo: boolean;
}

export type UsuarioRequest = {
    nombre: string;
    email: string;
    password: string;
    rol: Rol;
};