// src/routes/usuarios.routes.ts
import { Router } from "express";
import {
  getUsuarios,
  postUsuario,
  putUsuario,
  deleteUsuario,
} from "../controllers/usuarios.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authMiddleware, getUsuarios);
router.post("/", authMiddleware, postUsuario);
router.put("/:id", authMiddleware, putUsuario);
router.delete("/:id", authMiddleware, deleteUsuario);

export default router;