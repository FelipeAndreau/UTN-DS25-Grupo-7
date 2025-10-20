// src/config/prisma.ts
import { PrismaClient } from "@prisma/client";

// Configuración simplificada para producción (Render)
declare global {
  var prisma: PrismaClient | undefined;
}

// Usar una instancia global para evitar múltiples conexiones CAMBIO
// Configurar la URL de la base de datos con parámetros optimizados para Render
// Configurar la URL de la base de datos con parámetros optimizados para Render
const getDatabaseUrl = () => {
  const baseUrl = process.env.DATABASE_URL;
  if (!baseUrl) return baseUrl;
  
  // Si ya tiene parámetros de conexión, devolverla tal como está
  if (baseUrl.includes('connection_limit') || baseUrl.includes('pool_timeout')) {
    return baseUrl;
  }
  
  // Agregar parámetros optimizados para Render + Supabase
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}connection_limit=3&pool_timeout=20&connect_timeout=30&pgbouncer=true&sslmode=require`;
};
 

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

console.log(`✅ Cliente Prisma inicializado para Render`);

export default prisma;
