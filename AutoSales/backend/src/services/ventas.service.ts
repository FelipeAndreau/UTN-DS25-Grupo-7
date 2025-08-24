import prisma from "../config/prisma";
import { Venta } from "@prisma/client";
import { CreateVentaRequest, UpdateVentaRequest } from "../types/ventas.types";

/**
 * Listar todas las ventas ordenadas por fecha descendente.
 */
export async function listarVentas(): Promise<Venta[]> {
  try {
    console.log("🔍 Ejecutando listarVentas...");
    const ventas = await prisma.venta.findMany({
      orderBy: { fecha: "desc" },
      include: { 
        cliente: {
          select: {
            id: true,
            nombre: true,
            email: true
          }
        }, 
        vehiculo: {
          select: {
            id: true,
            marca: true,
            modelo: true,
            anio: true
          }
        } 
      },
    });
    console.log(`✅ Encontradas ${ventas.length} ventas`);
    return ventas;
  } catch (error) {
    console.error("❌ Error en listarVentas:", error);
    throw error;
  }
}

/**
 * Obtener una venta por ID.
 */
export async function obtenerVentaPorId(id: number): Promise<Venta> {
  const venta = await prisma.venta.findUnique({
    where: { id },
    include: { cliente: true, vehiculo: true },
  });
  if (!venta) {
    const error = new Error("Venta no encontrada");
    (error as any).statusCode = 404;
    throw error;
  }
  return venta;
}

/**
 * Registrar nueva venta.
 */
export async function registrarVenta(data: CreateVentaRequest): Promise<Venta> {
  if (!data.clienteId || !data.vehiculoId || !data.monto) {
    const error = new Error("Cliente, vehículo y monto son obligatorios");
    (error as any).statusCode = 400;
    throw error;
  }

  return prisma.venta.create({
    data: {
      clienteId: data.clienteId,
      vehiculoId: data.vehiculoId,
      monto: data.monto,
      fecha: data.fecha ?? new Date(),
    },
  });
}

/**
 * Editar una venta.
 */
export async function editarVenta(
  id: number,
  updateData: UpdateVentaRequest
): Promise<Venta> {
  try {
    return await prisma.venta.update({
      where: { id },
      data: {
        ...(updateData.clienteId && { clienteId: updateData.clienteId }),
        ...(updateData.vehiculoId && { vehiculoId: updateData.vehiculoId }),
        ...(updateData.monto !== undefined && { monto: updateData.monto }),
        ...(updateData.fecha && { fecha: updateData.fecha }),
      },
    });
  } catch (e: any) {
    if (e.code === "P2025") {
      const error = new Error("Venta no encontrada");
      (error as any).statusCode = 404;
      throw error;
    }
    throw e;
  }
}

/**
 * Eliminar una venta.
 */
export async function eliminarVenta(id: number): Promise<Venta> {
  try {
    return await prisma.venta.delete({ where: { id } });
  } catch (e: any) {
    if (e.code === "P2025") {
      const error = new Error("Venta no encontrada");
      (error as any).statusCode = 404;
      throw error;
    }
    throw e;
  }
}