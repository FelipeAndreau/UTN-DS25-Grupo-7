import { Pool } from "pg";
import { Config } from "../types/config.types";

export async function getConfigByUserId(db: Pool, userId: string): Promise<Config | null> {
  const result = await db.query("SELECT idioma, tema, notificaciones FROM configuraciones WHERE usuario_id = $1", [userId]);
  return result.rows[0] || null;
}

export async function updateConfig(db: Pool, userId: string, config: Partial<Config>): Promise<void> {
  const { idioma, tema, notificaciones } = config;
  await db.query(
    `UPDATE configuraciones SET 
      idioma = COALESCE($1, idioma), 
      tema = COALESCE($2, tema), 
      notificaciones = COALESCE($3, notificaciones) 
      WHERE usuario_id = $4`,
    [idioma, tema, notificaciones, userId]
  );
}