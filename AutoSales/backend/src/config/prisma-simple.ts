// src/config/prisma-simple.ts
import { PrismaClient } from "@prisma/client";

// Configuración simple sin detección automática (para evitar top-level await)
declare global {
  var prisma: PrismaClient | undefined;
}

// Determinar URL de base de datos según NETWORK_MODE
function getDatabaseUrl(): string {
  const mode = process.env.NETWORK_MODE || 'auto';
  
  switch (mode) {
    case 'ipv4':
      return process.env.DATABASE_URL_IPV4 || process.env.DATABASE_URL || '';
    case 'ipv6':
      return process.env.DATABASE_URL_IPV6 || process.env.DATABASE_URL || '';
    default:
      // Auto: usar IPv4 por defecto para compatibilidad
      return process.env.DATABASE_URL || process.env.DATABASE_URL_IPV4 || '';
  }
}

// Usar una instancia global para evitar múltiples conexiones
const prisma = globalThis.prisma ?? new PrismaClient({
  log: ['error', 'warn'],
  datasources: {
    db: {
      url: getDatabaseUrl(),
    },
  },
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

console.log(`✅ Cliente Prisma inicializado (modo: ${process.env.NETWORK_MODE || 'auto'})`);

export default prisma;
