// src/config/prisma.ts
import { PrismaClient } from "@prisma/client";

// Crear instancia global de Prisma con configuración específica para evitar prepared statements duplicados
declare global {
  var prisma: PrismaClient | undefined;
}

// Función para determinar la URL de base de datos según NETWORK_MODE
function getDatabaseUrl(): string {
  const mode = process.env.NETWORK_MODE || 'auto';
  
  switch (mode) {
    case 'ipv4':
      console.log('🌐 Usando configuración IPv4 (Facultad)');
      return process.env.DATABASE_URL_IPV4 || process.env.DATABASE_URL || '';
    case 'ipv6':
      console.log('🌐 Usando configuración IPv6 (Casa - Pooler)');
      return process.env.DATABASE_URL_IPV6 || process.env.DATABASE_URL || '';
    default:
      console.log('🌐 Detección automática: usando IPv4 por compatibilidad');
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