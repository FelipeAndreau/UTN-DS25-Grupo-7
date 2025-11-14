// Test de integración 2: Vehiculos endpoints
import request from 'supertest';
import express from 'express';
import vehiculosRoutes from '../../routes/vehiculos.routes';
import { generateToken } from '../../utils/jwt';

// Mock de prisma
jest.mock('../../config/prisma', () => ({
  __esModule: true,
  default: {
    vehiculo: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

import prisma from '../../config/prisma';

const app = express();
app.use(express.json());
app.use('/api/vehiculos', vehiculosRoutes);

describe('Integration Test - Vehiculos Endpoints', () => {
  const mockVehiculos = [
    {
      id: 1,
      marca: 'Toyota',
      modelo: 'Corolla',
      anio: 2020,
      precio: 20000,
      estado: 'disponible',
      imagen: null,
      descripcion: 'Vehículo en excelente estado',
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    },
    {
      id: 2,
      marca: 'Honda',
      modelo: 'Civic',
      anio: 2019,
      precio: 18000,
      estado: 'disponible',
      imagen: null,
      descripcion: null,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/vehiculos (público)', () => {
    it('debería obtener lista de vehículos sin autenticación', async () => {
      (prisma.vehiculo.findMany as jest.Mock).mockResolvedValue(mockVehiculos);

      const response = await request(app).get('/api/vehiculos');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].marca).toBe('Toyota');
    });
  });

  describe('POST /api/vehiculos (admin)', () => {
    it('debería crear un vehículo con token de admin', async () => {
      const adminToken = generateToken({ id: '1', email: 'admin@test.com', rol: 'admin' });
      const newVehiculo = { ...mockVehiculos[0] };
      
      (prisma.vehiculo.create as jest.Mock).mockResolvedValue(newVehiculo);

      const response = await request(app)
        .post('/api/vehiculos')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          marca: 'Toyota',
          modelo: 'Corolla',
          anio: 2020,
          precio: 20000,
          estado: 'Disponible',
          imagen: 'https://example.com/image.jpg',
          descripcion: 'Excelente vehículo',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.marca).toBe('Toyota');
    });

    it('debería rechazar creación sin token', async () => {
      const response = await request(app)
        .post('/api/vehiculos')
        .send({
          marca: 'Toyota',
          modelo: 'Corolla',
          anio: 2020,
          precio: 20000,
          estado: 'disponible',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('debería rechazar creación con rol viewer', async () => {
      const viewerToken = generateToken({ id: '2', email: 'viewer@test.com', rol: 'viewer' });

      const response = await request(app)
        .post('/api/vehiculos')
        .set('Authorization', `Bearer ${viewerToken}`)
        .send({
          marca: 'Toyota',
          modelo: 'Corolla',
          anio: 2020,
          precio: 20000,
          estado: 'Disponible',
          imagen: 'https://example.com/image.jpg',
          descripcion: 'Excelente vehículo',
        });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('No autorizado');
    });
  });

  describe('GET /api/vehiculos/admin (protegido)', () => {
    it('debería obtener vehículos con token de admin', async () => {
      const adminToken = generateToken({ id: '1', email: 'admin@test.com', rol: 'admin' });
      (prisma.vehiculo.findMany as jest.Mock).mockResolvedValue(mockVehiculos);

      const response = await request(app)
        .get('/api/vehiculos/admin')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });

    it('debería rechazar acceso sin token', async () => {
      const response = await request(app).get('/api/vehiculos/admin');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/vehiculos/viewer (protegido)', () => {
    it('debería obtener vehículos con token de viewer', async () => {
      const viewerToken = generateToken({ id: '2', email: 'viewer@test.com', rol: 'viewer' });
      (prisma.vehiculo.findMany as jest.Mock).mockResolvedValue(mockVehiculos);

      const response = await request(app)
        .get('/api/vehiculos/viewer')
        .set('Authorization', `Bearer ${viewerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });
  });
});
