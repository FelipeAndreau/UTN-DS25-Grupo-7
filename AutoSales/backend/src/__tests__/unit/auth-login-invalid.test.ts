// Test unitario 5: loginUser con credenciales inválidas
import { loginUser } from '../../services/auth.service';

jest.mock('../../config/prisma', () => ({
  __esModule: true,
  default: {
    usuario: {
      findUnique: jest.fn().mockResolvedValue(null),
    },
  },
}));

describe('Auth Service - loginUser credenciales inválidas', () => {
  it('debería lanzar error con credenciales inválidas', async () => {
    await expect(
      loginUser('wrong@test.com', 'wrongpassword')
    ).rejects.toThrow('Credenciales inválidas');
  });
});
