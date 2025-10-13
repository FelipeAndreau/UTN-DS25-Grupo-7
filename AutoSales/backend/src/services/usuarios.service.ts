// src/services/usuarios.service.ts
import prisma from "../config/prisma";
import { UsuarioRequest, UsuarioAdminDTO } from "../types/usuarios.types";
import bcrypt from "bcrypt";

export const listarUsuarios = async (): Promise<UsuarioAdminDTO[]> => {
  return await prisma.usuario.findMany({
    select: {
      id: true,
      nombre: true,
      email: true,
      rol: true,
      activo: true,
    },
  }) as UsuarioAdminDTO[];
};

export const registrarUsuario = async (data: UsuarioRequest) => {
  await prisma.usuario.create({
    data: {
      nombre: data.nombre,
      email: data.email,
      password: bcrypt.hashSync(data.password, 10),
      rol: data.rol as any,
    },
  });
};

export const editarUsuario = async (id: string, data: Partial<UsuarioRequest>) => {
  const updateData: any = {
    ...(data.nombre && { nombre: data.nombre }),
    ...(data.email && { email: data.email }),
    ...(data.rol && { rol: data.rol }),
  };
  if (data.password) {
    updateData.password = bcrypt.hashSync(data.password, 10);
  }
  await prisma.usuario.update({
    where: { id },
    data: updateData,
  });
};

export const eliminarUsuario = async (id: string) => {
  try {
    // Verificar que el usuario existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id },
    });
    
    if (!usuarioExistente) {
      const error = new Error("Usuario no encontrado");
      (error as any).statusCode = 404;
      throw error;
    }

    // Usar transacción para eliminar todo en orden
    await prisma.$transaction(async (tx) => {
      // 1. Eliminar configuración del usuario si existe
      await tx.configuracion.deleteMany({
        where: { usuarioId: id },
      });
      
      // 2. Si el usuario tiene un cliente asociado, manejarlo
      const cliente = await tx.cliente.findUnique({
        where: { usuarioId: id },
      });
      
      if (cliente) {
        // Eliminar reservas del cliente
        await tx.reserva.deleteMany({
          where: { clienteId: cliente.id },
        });
        
        // Eliminar ventas del cliente
        await tx.venta.deleteMany({
          where: { clienteId: cliente.id },
        });
        
        // Eliminar el cliente
        await tx.cliente.delete({
          where: { id: cliente.id },
        });
      }
      
      // 3. Finalmente eliminar el usuario
      await tx.usuario.delete({
        where: { id },
      });
    });

    return usuarioExistente;
  } catch (error: any) {
    console.error("❌ Error eliminando usuario:", error);
    if (error.statusCode) {
      throw error;
    }
    const newError = new Error("Error interno al eliminar usuario");
    (newError as any).statusCode = 500;
    throw newError;
  }
};