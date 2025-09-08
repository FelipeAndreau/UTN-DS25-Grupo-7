// src/services/config.service.ts

import prisma from "../config/prisma";
import { ConfigResponse, UpdateConfigRequest } from "../types/config.types";

const CONFIG_DEFAULT: ConfigResponse = {
  idioma: "es",
  tema: "claro",
};

export async function obtenerConfiguracion(userId: string): Promise<ConfigResponse> {
  const config = await prisma.configuracion.findUnique({
    where: { usuarioId: userId },
    select: { idioma: true, tema: true },
  });

  return config ?? CONFIG_DEFAULT;
}

export async function actualizarConfiguracion(userId: string, data: UpdateConfigRequest) {
  return prisma.configuracion.upsert({
    where: { usuarioId: userId },
    update: data,
    create: {
      usuarioId: userId,
      idioma: data?.idioma ?? CONFIG_DEFAULT.idioma,
      tema: data?.tema ?? CONFIG_DEFAULT.tema,
    },
  });
}