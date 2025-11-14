// Test unitario 4: loginUser con credenciales hardcoded viewer
import { loginUser } from '../../services/auth.service';

jest.mock('../../config/prisma', () => ({
  __esModule: true,
  default: {
    usuario: {
      findUnique: jest.fn(),
    },
  },
}));

describe('Auth Service - loginUser Viewer', () => {
  it('debería permitir login con credenciales viewer hardcoded', async () => {
    const result = await loginUser('viewer@test.com', 'viewer123');
    
    expect(result).toBeDefined();
    expect(result.token).toBeDefined();
    expect(result.user.id).toBe('temp-viewer-id');
    expect(result.user.rol).toBe('viewer');
    expect(result.user.nombre).toBe('Usuario Viewer');
  });
});
