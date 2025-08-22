// src/routes/reservas.routes.ts
import { Router } from "express"
import * as reservaController from "../controllers/reservas.controller"

const router = Router()

// Crear nueva reserva
router.post("/", reservaController.crearReserva)

// Admin: ver todas
router.get("/", reservaController.listarReservasAdmin)

// Cliente: ver solo las suyas
router.get("/cliente/:clienteId", reservaController.listarReservasCliente)

// Cancelar
router.patch("/:id/cancelar", reservaController.cancelarReserva)

export default router;