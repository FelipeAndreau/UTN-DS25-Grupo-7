// src/routes/clientes.routes.ts
import { Router } from "express";
import {
  getClientes,
  postCliente,
  putCliente,
  deleteCliente,
} from "../controllers/clientes.controller";

const router = Router();

router.get("/", getClientes);
router.post("/", postCliente);
router.put("/:id", putCliente);
router.delete("/:id", deleteCliente);

export default router;