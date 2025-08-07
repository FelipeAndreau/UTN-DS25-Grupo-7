// src/types/usuarios.types.ts
export interface Usuario {
    id: string;
    nombre: string;
    email: string;
    rol: "admin" | "vendedor" | "viewer";
}

export type UsuarioRequest = Omit<Usuario, "id">;

export type UsuarioResponse = Usuario[];