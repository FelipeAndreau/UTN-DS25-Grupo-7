// src/config/prisma-vercel-simple.ts
import { PrismaClient } from "@prisma/client";

// Configuración simple para Vercel
declare global {
  var prisma: PrismaClient | undefined;
}

// Usar instancia global para evitar múltiples conexiones en serverless
const prisma = globalThis.prisma ?? new PrismaClient({
  log: ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;