// Test de integración 1: Auth endpoints (login)
import request from 'supertest';
import express from 'express';
import authRoutes from '../../routes/auth.routes';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Integration Test - Auth Endpoints', () => {
  describe('POST /api/auth/login', () => {
    it('debería realizar login exitoso con credenciales admin hardcoded', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'admin123',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.rol).toBe('admin');
      expect(response.body.user.nombre).toBe('Administrador Temporal');
    });

    it('debería realizar login exitoso con credenciales viewer hardcoded', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'viewer@test.com',
          password: 'viewer123',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.rol).toBe('viewer');
    });

    it('debería retornar error 401 con credenciales inválidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@test.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Credenciales inválidas');
    });

    it('debería retornar error 400 si faltan campos requeridos', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@test.com',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('requeridos');
    });

    it('debería retornar error 400 con email inválido', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('email inválido');
    });
  });
});
