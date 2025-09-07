// src/types/auth.types.ts
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
      id: string;
      rol: string;
      nombre: string;
    };
}