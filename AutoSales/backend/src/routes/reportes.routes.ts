// src/routes/reportes.routes.ts
import { Router } from "express";
import {
  getVentas,
  getClientes,
  getVehiculos,
} from "../controllers/reportes.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/ventas", authMiddleware, getVentas);
router.get("/clientes", authMiddleware, getClientes);
router.get("/vehiculos", authMiddleware, getVehiculos);

export default router;