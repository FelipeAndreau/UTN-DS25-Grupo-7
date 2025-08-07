// src/routes/vehiculos.routes.ts
import { Router } from "express";
import {
  getVehiculos,
  postVehiculo,
  putVehiculo,
  deleteVehiculo,
} from "../controllers/vehiculos.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authMiddleware, getVehiculos);
router.post("/", authMiddleware, postVehiculo);
router.put("/:id", authMiddleware, putVehiculo);
router.delete("/:id", authMiddleware, deleteVehiculo);

export default router;