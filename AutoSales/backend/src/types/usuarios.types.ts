// src/types/usuarios.types.ts

export enum Rol {
    admin = "admin",
    editor = "editor", 
    viewer = "viewer"
}

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