// src/services/clientes.service.ts
import prisma from "../config/prisma";
import { Cliente } from "../generated/prisma";
import { CreateClienteRequest, UpdateClienteRequest } from "../types/clientes.types";

/**
 * Listar todos los clientes ordenados por fecha de creación descendente.
 */
export async function listarClientes(): Promise<Cliente[]> {
  const clientes = await prisma.cliente.findMany({
    orderBy: { creadoEn: "desc" },
  });
  return clientes
}

/**
 * Obtener un cliente por ID.
 * Lanza un error con statusCode 404 si no existe.
 */
export async function obtenerClientePorNombreMailTelefono(id: string): Promise<Cliente> {
  const cliente = await prisma.cliente.findUnique({ where: { id } });
  if (!cliente) {
    const error = new Error("Cliente no encontrado");
    (error as any).statusCode = 404;
    throw error;
  }
  return cliente;
}

/**
 * Registrar un nuevo cliente.
 * Aplica validaciones de negocio antes de crear.
 */
export async function registrarCliente(data: CreateClienteRequest): Promise<Cliente> {
  // Ejemplo de validación: nombre obligatorio
  if (!data.nombre || data.nombre.trim() === "") {
    const error = new Error("El nombre es obligatorio");
    (error as any).statusCode = 400;
    throw error;
  }

  const created = await prisma.cliente.create({
      data: {
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono,
        actividad: data.actividad,
        tipo: data.tipo,
        estado: data.estado
      } 
    }
  );

  return created
}

/**
 * Editar un cliente existente.
 * Permite actualizaciones parciales.
 * Lanza error 404 si no existe.
 */
export async function editarCliente(
  id: string,
  updateData: UpdateClienteRequest
): Promise<Cliente> {
  try {
    const updated = await prisma.cliente.update({
      where: { id },
      data: {
        ...(updateData.nombre !== undefined ? { nombre: updateData.nombre } : {}),
        ...(updateData.email !== undefined ? { email: updateData.email } : {}),
        ...(updateData.telefono !== undefined ? { telefono: updateData.telefono } : {}),
        ...(updateData.tipo !== undefined ? { tipo: updateData.tipo } : {}),
        ...(updateData.estado !== undefined ? { estado: updateData.estado } : {}),
        ...(updateData.actividad !== undefined ? { actividad: updateData.actividad } : {}),
      },
    });
    return updated;
  } catch (e: any) {
    if (e.code === "P2025") {
      const error = new Error("Cliente no encontrado");
      (error as any).statusCode = 404;
      throw error;
    }
    throw e;
  }
}

/**
 * Eliminar un cliente por ID.
 * Lanza error 404 si no existe.
 */
export async function eliminarCliente(id: string): Promise<Cliente> {
  try {
    return await prisma.cliente.delete({
      where: { id },
    });
  } catch (e: any) {
    if (e.code === "P2025") {
      const error = new Error("Cliente no encontrado");
      (error as any).statusCode = 404;
      throw error;
    }
    throw e;
  }
}