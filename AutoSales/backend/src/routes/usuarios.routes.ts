// src/routes/usuarios.routes.ts
import { Router } from "express";
import {
  getUsuarios,
  postUsuario,
  putUsuario,
  deleteUsuario,
} from "../controllers/usuarios.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/requireRoleMiddleware";

const router = Router();

router.get("/", authMiddleware, getUsuarios);
router.post("/", authMiddleware, requireRole(["admin"]), postUsuario);
router.put("/:id", authMiddleware, requireRole(["admin"]), putUsuario);
router.delete("/:id", authMiddleware, requireRole(["admin"]), deleteUsuario);

export default router;