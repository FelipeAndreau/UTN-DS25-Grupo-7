// Test unitario 7: obtenerVehiculoPorId
import { obtenerVehiculoPorId } from '../../services/vehiculos.service';

jest.mock('../../config/prisma', () => ({
  __esModule: true,
  default: {
    vehiculo: {
      findUnique: jest.fn(),
    },
  },
}));

import prisma from '../../config/prisma';

describe('Vehiculos Service - obtenerVehiculoPorId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería retornar un vehículo existente', async () => {
    const mockVehiculo = {
      id: 1,
      marca: 'Honda',
      modelo: 'Civic',
      anio: 2019,
      precio: 18000,
      estado: 'disponible',
      imagen: null,
      descripcion: null,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    };

    (prisma.vehiculo.findUnique as jest.Mock).mockResolvedValue(mockVehiculo);

    const result = await obtenerVehiculoPorId(1);

    expect(result).toEqual(mockVehiculo);
    expect(prisma.vehiculo.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('debería lanzar error 404 si el vehículo no existe', async () => {
    (prisma.vehiculo.findUnique as jest.Mock).mockResolvedValue(null);

    try {
      await obtenerVehiculoPorId(999);
      fail('Debería haber lanzado un error');
    } catch (error: any) {
      expect(error.message).toBe('Vehículo no encontrado');
      expect(error.statusCode).toBe(404);
    }
  });
});
