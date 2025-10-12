import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Test básico de variables de entorno
    const dbUrl = process.env.DATABASE_URL;
    const nodeEnv = process.env.NODE_ENV;
    
    if (!dbUrl) {
      return res.status(500).json({ 
        error: 'DATABASE_URL no está configurada',
        env: {
          NODE_ENV: nodeEnv,
          hasDbUrl: !!dbUrl
        }
      });
    }

    // Intentar importar y usar Prisma
    let prismaTest;
    try {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient({
        datasources: {
          db: {
            url: dbUrl,
          },
        },
      });
      
      // Test simple de conexión
      await prisma.$queryRaw`SELECT 1 as test`;
      prismaTest = { status: 'success', message: 'Conexión a DB exitosa' };
      
      await prisma.$disconnect();
    } catch (dbError: any) {
      prismaTest = { 
        status: 'error', 
        message: dbError.message,
        code: dbError.code
      };
    }

    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: nodeEnv,
        DATABASE_URL: dbUrl ? 'configured' : 'missing',
        DATABASE_URL_preview: dbUrl ? dbUrl.substring(0, 50) + '...' : 'N/A'
      },
      database: prismaTest
    });

  } catch (error: any) {
    res.status(500).json({
      error: 'Error en diagnóstico',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}