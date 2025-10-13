// src/services/vehiculos.service.ts
import prisma from "../config/prisma";
import { Vehiculo, CreateVehiculoRequest, UpdateVehiculoRequest } from "../types/vehiculos.types";

/**
 * Listar todos los vehículos ordenados por fecha de creación descendente.
 */
export async function listarVehiculos(): Promise<Vehiculo[]> {
  console.log("🚗 Obteniendo lista de vehículos...");
  const vehiculos = await prisma.vehiculo.findMany({
    orderBy: { creadoEn: "desc" },
  });
  console.log(`✅ Encontrados ${vehiculos.length} vehículos en BD`);
  return vehiculos;
};

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
};

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
      estado: data.estado as any,
      imagen: data.imagen,
      descripcion: data.descripcion,
    },
  });
};

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
        ...(updateData.estado !== undefined ? { estado: updateData.estado as any } : {}),
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
};

/**
 * Eliminar un vehículo por ID.
 * Lanza error 404 si no existe.
 * Elimina primero todas las relaciones (reservas y ventas) antes de eliminar el vehículo.
 */
export async function eliminarVehiculo(id: number): Promise<Vehiculo> {
  try {
    // Verificar que el vehículo existe
    const vehiculoExistente = await prisma.vehiculo.findUnique({
      where: { id },
    });
    
    if (!vehiculoExistente) {
      const error = new Error("Vehículo no encontrado");
      (error as any).statusCode = 404;
      throw error;
    }

    // Eliminar en orden: primero las dependencias, luego el vehículo
    await prisma.$transaction(async (tx) => {
      // Eliminar todas las reservas del vehículo
      await tx.reserva.deleteMany({
        where: { vehiculoId: id },
      });
      
      // Eliminar todas las ventas del vehículo
      await tx.venta.deleteMany({
        where: { vehiculoId: id },
      });
      
      // Finalmente eliminar el vehículo
      await tx.vehiculo.delete({
        where: { id },
      });
    });

    return vehiculoExistente;
  } catch (e: any) {
    console.error("❌ Error eliminando vehículo:", e);
    if (e.statusCode) {
      throw e;
    }
    const error = new Error("Error interno al eliminar vehículo");
    (error as any).statusCode = 500;
    throw error;
  }
};