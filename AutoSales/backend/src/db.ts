import { Pool } from "pg";

export const pool = new Pool({
  user: "usuario",
  host: "localhost",
  database: "autosales",
  password: "contraseña",
  port: 5432,
});