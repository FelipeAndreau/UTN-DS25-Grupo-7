import { Router } from "express";
import {
  getVentas,
  postVenta,
  putVenta,
  deleteVenta,
} from "../controllers/ventas.controller";

const router = Router();

router.get("/", getVentas);
router.post("/", postVenta);
router.put("/:id", putVenta);
router.delete("/:id", deleteVenta);

export default router;