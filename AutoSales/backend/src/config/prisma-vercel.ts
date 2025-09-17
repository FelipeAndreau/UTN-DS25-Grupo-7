// src/config/prisma-vercel.ts
import { PrismaClient } from "@prisma/client";

// Configuración específica para Vercel
declare global {
  var prisma: PrismaClient | undefined;
}

// Función para obtener la URL de base de datos para Vercel
function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL;
  
  if (!url) {
    throw new Error("DATABASE_URL o POSTGRES_PRISMA_URL debe estar definida");
  }
  
  console.log("🔗 Conectando a base de datos en Vercel");
  return url;
}

// Usar instancia global para evitar múltiples conexiones en serverless
const prisma = globalThis.prisma || new PrismaClient({
  datasources: {
    db: {
      url: getDatabaseUrl()
    }
  },
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
});

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

// Manejar cierre de conexión en serverless
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;