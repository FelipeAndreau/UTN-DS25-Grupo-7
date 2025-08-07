// src/routes/clientes.routes.ts
import { Router } from "express";
import {
  getClientes,
  postCliente,
  putCliente,
  deleteCliente,
} from "../controllers/clientes.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authMiddleware, getClientes);
router.post("/", authMiddleware, postCliente);
router.put("/:id", authMiddleware, putCliente);
router.delete("/:id", authMiddleware, deleteCliente);

export default router;