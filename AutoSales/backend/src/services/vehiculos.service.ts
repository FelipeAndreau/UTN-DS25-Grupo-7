// src/services/vehiculos.service.ts
import prisma from "../config/prisma";
import { Vehiculo } from "../generated/prisma";
import { CreateVehiculoRequest, UpdateVehiculoRequest } from "../types/vehiculos.types";

/**
 * Listar todos los vehículos ordenados por fecha de creación descendente.
 */
export async function listarVehiculos(): Promise<Vehiculo[]> {
  return prisma.vehiculo.findMany({
    orderBy: { creadoEn: "desc" },
  });
}

/**
 * Obtener un vehículo por ID.
 * Lanza un error con statusCode 404 si no existe.
 */
export async function obtenerVehiculoPorId(id: number): Promise<Vehiculo> {
  const vehiculo = await prisma.vehiculo.findUnique({ where: { id } });
  if (!vehiculo) {
    const error = new Error("Vehículo no encontrado");
    (error as any).statusCode = 404;
    throw error;
  }
  return vehiculo;
}

/**
 * Registrar un nuevo vehículo.
 * Aplica validaciones de negocio antes de crear.
 */
export async function registrarVehiculo(data: CreateVehiculoRequest): Promise<Vehiculo> {
  if (!data.marca || data.marca.trim() === "") {
    const error = new Error("La marca es obligatoria");
    (error as any).statusCode = 400;
    throw error;
  }
  if (!data.modelo || data.modelo.trim() === "") {
    const error = new Error("El modelo es obligatorio");
    (error as any).statusCode = 400;
    throw error;
  }

  return prisma.vehiculo.create({
    data: {
      marca: data.marca,
      modelo: data.modelo,
      anio: data.anio,
      precio: data.precio,
      estado: data.estado,
      imagen: data.imagen,
      descripcion: data.descripcion,
    },
  });
}

/**
 * Editar un vehículo existente.
 * Permite actualizaciones parciales.
 * Lanza error 404 si no existe.
 */
export async function editarVehiculo(
  id: number,
  updateData: UpdateVehiculoRequest
): Promise<Vehiculo> {
  try {
    return await prisma.vehiculo.update({
      where: { id },
      data: {
        ...(updateData.marca !== undefined ? { marca: updateData.marca } : {}),
        ...(updateData.modelo !== undefined ? { modelo: updateData.modelo } : {}),
        ...(updateData.anio !== undefined ? { anio: updateData.anio } : {}),
        ...(updateData.precio !== undefined ? { precio: updateData.precio } : {}),
        ...(updateData.estado !== undefined ? { estado: updateData.estado } : {}),
        ...(updateData.imagen !== undefined ? { imagen: updateData.imagen } : {}),
        ...(updateData.descripcion !== undefined ? { descripcion: updateData.descripcion } : {}),
      },
    });
  } catch (e: any) {
    if (e.code === "P2025") {
      const error = new Error("Vehículo no encontrado");
      (error as any).statusCode = 404;
      throw error;
    }
    throw e;
  }
}

/**
 * Eliminar un vehículo por ID.
 * Lanza error 404 si no existe.
 */
export async function eliminarVehiculo(id: number): Promise<Vehiculo> {
  try {
    return await prisma.vehiculo.delete({
      where: { id },
    });
  } catch (e: any) {
    if (e.code === "P2025") {
      const error = new Error("Vehículo no encontrado");
      (error as any).statusCode = 404;
      throw error;
    }
    throw e;
  }
}