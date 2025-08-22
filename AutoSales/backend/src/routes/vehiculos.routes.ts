// src/routes/vehiculos.routes.ts
import { Router } from "express";
import {
  getVehiculos,
  postVehiculo,
  putVehiculo,
  deleteVehiculo,
} from "../controllers/vehiculos.controller";

const router = Router();

router.get("/", getVehiculos);
router.post("/", postVehiculo);
router.put("/:id", putVehiculo);
router.delete("/:id", deleteVehiculo);

export default router;