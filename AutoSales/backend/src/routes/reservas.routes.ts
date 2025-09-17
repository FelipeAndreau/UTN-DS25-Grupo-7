// src/routes/reservas.routes.ts
import { Router } from "express"
import * as reservaController from "../controllers/reservas.controller"
import { authMiddleware } from "../middlewares/auth.middleware"
import { validateBody, validateParams } from "../middlewares/validation.middleware";
import { createReservaSchema } from "../validations/reserva.validation";
import { numericIdSchema, uuidSchema } from "../validations/common.validation";

const router = Router()

/**
 * @swagger
 * /api/public/reservas:
 *   get:
 *     summary: Obtener reservas públicas
 *     tags: [Reservas Públicas]
 *     responses:
 *       200:
 *         description: Lista de reservas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reserva'
 */
// Ruta pública para obtener reservas (sin autenticación)
router.get("/", (req, res) => {
  res.json({ 
    success: true, 
    message: "Reservas públicas obtenidas exitosamente", 
    data: []
  });
});

/**
 * @swagger
 * /api/reservas:
 *   post:
 *     summary: Crear una nueva reserva (público)
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehiculoId
 *             properties:
 *               vehiculoId:
 *                 type: integer
 *               clienteId:
 *                 type: string
 *                 description: Opcional, si no se proporciona se usa cliente anónimo
 *     responses:
 *       201:
 *         description: Reserva creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post("/", validateBody(createReservaSchema), reservaController.crearReserva)

/**
 * @swagger
 * /api/reservas/crear:
 *   post:
 *     summary: Crear una nueva reserva (usuario autenticado)
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehiculoId
 *             properties:
 *               vehiculoId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Reserva creada exitosamente
 *       401:
 *         description: No autorizado
 */
router.post("/crear", authMiddleware, validateBody(createReservaSchema), reservaController.crearReserva)

/**
 * @swagger
 * /api/reservas/admin:
 *   get:
 *     summary: Obtener todas las reservas (admin y viewer)
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas las reservas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   clienteId:
 *                     type: string
 *                   vehiculoId:
 *                     type: integer
 *                   fecha:
 *                     type: string
 *                     format: date-time
 *                   estado:
 *                     type: string
 *       401:
 *         description: No autorizado
 */
router.get("/admin", authMiddleware, reservaController.listarReservasAdmin)

/**
 * @swagger
 * /api/reservas/mis-reservas:
 *   get:
 *     summary: Obtener mis reservas (usuario autenticado)
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservas del usuario
 *       401:
 *         description: No autorizado
 */
router.get("/mis-reservas", authMiddleware, reservaController.obtenerMisReservas)

/**
 * @swagger
 * /api/reservas/cliente/{clienteId}:
 *   get:
 *     summary: Obtener reservas de un cliente específico
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de reservas del cliente
 *       404:
 *         description: Cliente no encontrado
 */
router.get("/cliente/:clienteId", reservaController.listarReservasCliente)

/**
 * @swagger
 * /api/reservas/{id}/cancelar:
 *   patch:
 *     summary: Cancelar una reserva
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reserva cancelada exitosamente
 *       404:
 *         description: Reserva no encontrada
 */
router.patch("/:id/cancelar", reservaController.cancelarReserva)

/**
 * @swagger
 * /api/reservas/{id}:
 *   delete:
 *     summary: Eliminar una reserva
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reserva eliminada exitosamente
 *       404:
 *         description: Reserva no encontrada
 */
router.delete("/:id", reservaController.eliminarReserva)

export default router;