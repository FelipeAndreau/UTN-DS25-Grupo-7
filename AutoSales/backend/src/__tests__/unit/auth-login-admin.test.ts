// Test unitario 3: loginUser con credenciales hardcoded admin
import { loginUser } from '../../services/auth.service';

jest.mock('../../config/prisma', () => ({
  __esModule: true,
  default: {
    usuario: {
      findUnique: jest.fn(),
    },
  },
}));

describe('Auth Service - loginUser Admin', () => {
  it('debería permitir login con credenciales admin hardcoded', async () => {
    const result = await loginUser('admin@test.com', 'admin123');
    
    expect(result).toBeDefined();
    expect(result.token).toBeDefined();
    expect(result.user.id).toBe('temp-user-id');
    expect(result.user.rol).toBe('admin');
    expect(result.user.nombre).toBe('Administrador Temporal');
  });
});
