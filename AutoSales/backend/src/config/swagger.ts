import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AutoSales API',
      version: '1.0.0',
      description: 'API para el sistema de gestión de ventas de vehículos',
      contact: {
        name: 'AutoSales Team',
        email: 'support@autosales.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Usuario: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            nombre: { type: 'string' },
            email: { type: 'string', format: 'email' },
            rol: { type: 'string', enum: ['admin', 'viewer'] },
            activo: { type: 'boolean' },
          },
        },
        Cliente: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            nombre: { type: 'string' },
            email: { type: 'string', format: 'email' },
            telefono: { type: 'string' },
            tipo: { type: 'string', enum: ['Particular', 'Empresa'] },
            estado: { type: 'string', enum: ['Activo', 'En_proceso', 'Financiamiento', 'Potencial'] },
            actividad: { type: 'string' },
          },
        },
        Vehiculo: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            marca: { type: 'string' },
            modelo: { type: 'string' },
            anio: { type: 'integer' },
            precio: { type: 'number' },
            estado: { type: 'string', enum: ['Disponible', 'Reservado', 'Vendido'] },
            imagen: { type: 'string' },
            descripcion: { type: 'string' },
          },
        },
        Venta: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            clienteId: { type: 'string', format: 'uuid' },
            vehiculoId: { type: 'integer' },
            fecha: { type: 'string', format: 'date-time' },
            monto: { type: 'number' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                nombre: { type: 'string' },
                rol: { type: 'string' },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Rutas a los archivos con comentarios JSDoc
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
