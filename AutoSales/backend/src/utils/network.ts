// src/utils/network.ts
import { execSync } from 'child_process';
import dns from 'dns';
import { promisify } from 'util';

const lookup = promisify(dns.lookup);

export class NetworkUtils {
  /**
   * Detecta si la red actual soporta IPv6 o solo IPv4
   */
  static async detectNetworkType(): Promise<'ipv4' | 'ipv6'> {
    try {
      // Intentar resolver el hostname de Supabase con IPv6
      const result = await lookup('db.fbhsysehqmgvlykzqaug.supabase.co', { family: 6 });
      console.log('✅ Red IPv6 detectada');
      return 'ipv6';
    } catch (error) {
      console.log('⚠️  Red IPv4 detectada (sin soporte IPv6)');
      return 'ipv4';
    }
  }

  /**
   * Obtiene las URLs de conexión apropiadas según el tipo de red
   */
  static getConnectionUrls(networkType: 'ipv4' | 'ipv6') {
    const mode = process.env.NETWORK_MODE || 'auto';
    
    if (mode === 'ipv4' || (mode === 'auto' && networkType === 'ipv4')) {
      return {
        DATABASE_URL: process.env.DATABASE_URL_IPV4,
        DIRECT_URL: process.env.DIRECT_URL_IPV4,
        network: 'IPv4 (Conexión directa)'
      };
    }
    
    return {
      DATABASE_URL: process.env.DATABASE_URL_IPV6,
      DIRECT_URL: process.env.DIRECT_URL_IPV6,
      network: 'IPv6 (Pooler)'
    };
  }

  /**
   * Configura las variables de entorno dinámicamente
   */
  static async configureDatabase() {
    try {
      const networkType = await this.detectNetworkType();
      const urls = this.getConnectionUrls(networkType);
      
      // Actualizar las variables de entorno en tiempo de ejecución
      process.env.DATABASE_URL = urls.DATABASE_URL;
      process.env.DIRECT_URL = urls.DIRECT_URL;
      
      console.log(`🌐 Configuración de red: ${urls.network}`);
      console.log(`📡 DATABASE_URL configurada para: ${networkType}`);
      
      return { networkType, urls };
    } catch (error) {
      console.error('❌ Error detectando tipo de red:', error);
      console.log('🔄 Usando configuración IPv4 por defecto');
      
      process.env.DATABASE_URL = process.env.DATABASE_URL_IPV4;
      process.env.DIRECT_URL = process.env.DIRECT_URL_IPV4;
      
      return { 
        networkType: 'ipv4' as const, 
        urls: {
          DATABASE_URL: process.env.DATABASE_URL_IPV4,
          DIRECT_URL: process.env.DIRECT_URL_IPV4,
          network: 'IPv4 (Fallback)'
        }
      };
    }
  }

  /**
   * Prueba la conectividad de la base de datos
   */
  static async testConnection(): Promise<boolean> {
    try {
      // Importar Prisma dinámicamente para evitar problemas de inicialización
      const { PrismaClient } = await import('@prisma/client');
      const testPrisma = new PrismaClient({
        datasources: {
          db: {
            url: process.env.DATABASE_URL
          }
        }
      });
      
      await testPrisma.$connect();
      await testPrisma.$disconnect();
      
      console.log('✅ Conexión a base de datos exitosa');
      return true;
    } catch (error) {
      console.error('❌ Error de conexión a base de datos:', error);
      return false;
    }
  }
}