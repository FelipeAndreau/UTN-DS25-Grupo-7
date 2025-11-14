// Test unitario 8: registrarCliente
import { registrarCliente } from '../../services/clientes.service';
import { CreateClienteRequest } from '../../types/clientes.types';

jest.mock('../../config/prisma', () => ({
  __esModule: true,
  default: {
    cliente: {
      create: jest.fn(),
    },
  },
}));

import prisma from '../../config/prisma';

describe('Clientes Service - registrarCliente', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería crear un cliente con datos válidos', async () => {
    const mockCliente = {
      id: 'uuid-123',
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      telefono: '123456789',
      tipo: 'particular',
      estado: 'activo',
      actividad: null,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    };

    (prisma.cliente.create as jest.Mock).mockResolvedValue(mockCliente);

    const data: CreateClienteRequest = {
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      telefono: '123456789',
      tipo: 'particular',
      estado: 'activo',
    };

    const result = await registrarCliente(data);

    expect(result).toEqual(mockCliente);
    expect(prisma.cliente.create).toHaveBeenCalled();
  });

  it('debería lanzar error si el nombre está vacío', async () => {
    const data: CreateClienteRequest = {
      nombre: '',
      email: 'juan@example.com',
      telefono: '123456789',
      tipo: 'particular',
      estado: 'activo',
    };

    await expect(registrarCliente(data)).rejects.toThrow('El nombre es obligatorio');
  });
});
