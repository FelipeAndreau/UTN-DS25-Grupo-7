// src/services/config.service.ts
import { Pool } from "pg";
import { getConfigByUserId, updateConfig } from "../models/config.model";
import { Config, ConfigRequest } from "../types/config.types";

export async function obtenerConfiguracion(db: Pool, userId: string): Promise<Config | null> {
  return await getConfigByUserId(db, userId);
}

export async function actualizarConfiguracion(db: Pool, userId: string, config: ConfigRequest): Promise<void> {
  await updateConfig(db, userId, config);
}