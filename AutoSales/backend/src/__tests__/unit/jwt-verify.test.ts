// Test unitario 2: verifyToken
import { generateToken, verifyToken } from '../../utils/jwt';

describe('JWT Utils - verifyToken', () => {
  it('debería verificar y decodificar un token válido', () => {
    const payload = { id: '456', email: 'user@test.com', rol: 'viewer' };
    const token = generateToken(payload);
    
    const decoded = verifyToken(token);
    
    expect(decoded).toBeDefined();
    expect(decoded.id).toBe(payload.id);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.rol).toBe(payload.rol);
  });

  it('debería lanzar error con token inválido', () => {
    expect(() => {
      verifyToken('token-invalido');
    }).toThrow();
  });
});
