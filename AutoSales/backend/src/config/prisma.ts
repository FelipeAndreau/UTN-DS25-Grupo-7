// src/config/prisma.ts
import { PrismaClient } from "@prisma/client";

// Configuración simplificada para producción (Render)
declare global {
  var prisma: PrismaClient | undefined;
}

// Usar una instancia global para evitar múltiples conexiones
const prisma = globalThis.prisma ?? new PrismaClient({
  log: ['error', 'warn'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

console.log(`✅ Cliente Prisma inicializado para Render`);

export default prisma;