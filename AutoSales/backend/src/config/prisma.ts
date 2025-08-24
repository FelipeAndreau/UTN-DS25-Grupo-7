// src/config/prisma.ts
import { PrismaClient } from "@prisma/client";

// Crear una nueva instancia simple de Prisma
const prisma = new PrismaClient({
    log: ['error', 'warn'],
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
});

// Función simple para conectar
const connectDatabase = async () => {
    try {
        await prisma.$connect();
        console.log('✅ Conectado a la base de datos');
    } catch (error) {
        console.error('❌ Error conectando a la base de datos:', error);
    }
};

// Conectar inmediatamente
connectDatabase();

// Manejar cierre graceful
process.on('SIGINT', async () => {
    console.log('Cerrando conexión a la base de datos...');
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Cerrando conexión a la base de datos...');
    await prisma.$disconnect();
    process.exit(0);
});

export default prisma;