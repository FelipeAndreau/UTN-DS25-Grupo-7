// Test unitario 1: generateToken
import { generateToken, verifyToken } from '../../utils/jwt';

describe('JWT Utils - generateToken', () => {
  it('debería generar un token válido', () => {
    const payload = { id: '123', email: 'test@test.com', rol: 'admin' };
    const token = generateToken(payload);
    
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3); // JWT tiene 3 partes
  });
});
