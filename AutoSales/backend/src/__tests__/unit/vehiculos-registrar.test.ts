// Test unitario 6: registrarVehiculo
import { registrarVehiculo } from '../../services/vehiculos.service';
import { CreateVehiculoRequest } from '../../types/vehiculos.types';

jest.mock('../../config/prisma', () => ({
  __esModule: true,
  default: {
    vehiculo: {
      create: jest.fn(),
    },
  },
}));

import prisma from '../../config/prisma';

describe('Vehiculos Service - registrarVehiculo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería crear un vehículo con datos válidos', async () => {
    const mockVehiculo = {
      id: 1,
      marca: 'Toyota',
      modelo: 'Corolla',
      anio: 2020,
      precio: 20000,
      estado: 'disponible',
      imagen: null,
      descripcion: null,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    };

    (prisma.vehiculo.create as jest.Mock).mockResolvedValue(mockVehiculo);

    const data: CreateVehiculoRequest = {
      marca: 'Toyota',
      modelo: 'Corolla',
      anio: 2020,
      precio: 20000,
      estado: 'disponible',
    };

    const result = await registrarVehiculo(data);

    expect(result).toEqual(mockVehiculo);
    expect(prisma.vehiculo.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        marca: 'Toyota',
        modelo: 'Corolla',
      }),
    });
  });

  it('debería lanzar error si la marca está vacía', async () => {
    const data: CreateVehiculoRequest = {
      marca: '',
      modelo: 'Corolla',
      anio: 2020,
      precio: 20000,
      estado: 'disponible',
    };

    await expect(registrarVehiculo(data)).rejects.toThrow('La marca es obligatoria');
  });
});
