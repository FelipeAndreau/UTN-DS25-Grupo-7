// Test unitario 9: authMiddleware
import { Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { generateToken } from '../../utils/jwt';

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      header: jest.fn(),
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it('debería autenticar con token válido', () => {
    const payload = { id: '123', email: 'test@test.com', rol: 'admin' };
    const token = generateToken(payload);

    (mockRequest.header as jest.Mock).mockReturnValue(`Bearer ${token}`);

    authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.user).toBeDefined();
    expect(mockRequest.user?.id).toBe(payload.id);
    expect(mockRequest.user?.rol).toBe(payload.rol);
  });

  it('debería rechazar si no hay token', () => {
    (mockRequest.header as jest.Mock).mockReturnValue(undefined);

    authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Token de acceso requerido',
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('debería rechazar token inválido', () => {
    (mockRequest.header as jest.Mock).mockReturnValue('Bearer token-invalido');

    authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Token inválido',
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });
});
