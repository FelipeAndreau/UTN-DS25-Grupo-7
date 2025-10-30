// src/routes/ventas.routes.ts

import { Router } from "express";
import {
  getVentas,
  postVenta,
  putVenta,
  deleteVenta,
  putVentaCompletar,
} from "../controllers/ventas.controller";

import { createVentaSchema, updateVentaSchema } from "../validations/venta.validation";
import { validate } from "../middlewares/validation.middleware";
const router = Router();

/**
 * @swagger
 * /api/ventas:
 *   get:
 *     tags: [Ventas]
 *     summary: Obtener todas las ventas
 *     description: Retorna una lista de todas las ventas con información de clientes y vehículos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de ventas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Venta'
 *       401:
 *         description: No autorizado
 */
router.get("/", getVentas);

/**
 * @swagger
 * /api/ventas:
 *   post:
 *     tags: [Ventas]
 *     summary: Crear una nueva venta
 *     description: Registra una nueva venta en el sistema
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [clienteId, vehiculoId, monto]
 *             properties:
 *               clienteId:
 *                 type: string
 *                 format: uuid
 *                 example: "29f3553f-28e2-40c8-963c-56c05dfdd98d"
 *               vehiculoId:
 *                 type: integer
 *                 example: 2
 *               fecha:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-08-23T21:00:00.000Z"
 *               monto:
 *                 type: number
 *                 example: 27000
 *     responses:
 *       201:
 *         description: Venta creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post("/", validate(createVentaSchema), postVenta);

/**
 * @swagger
 * /api/ventas/{id}:
 *   put:
 *     tags: [Ventas]
 *     summary: Actualizar una venta
 *     description: Actualiza los datos de una venta existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la venta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Venta'
 *     responses:
 *       200:
 *         description: Venta actualizada exitosamente
 *       404:
 *         description: Venta no encontrada
 *   delete:
 *     tags: [Ventas]
 *     summary: Eliminar una venta
 *     description: Elimina una venta del sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la venta
 *     responses:
 *       200:
 *         description: Venta eliminada exitosamente
 *       404:
 *         description: Venta no encontrada
 */
router.put("/:id", validate(updateVentaSchema), putVenta);
router.delete("/:id", deleteVenta);

/**
 * @swagger
 * /api/ventas/{id}/completar:
 *   put:
 *     tags: [Ventas]
 *     summary: Completar una venta
 *     description: Marca la venta como completada cambiando el estado del vehículo a 'Vendido'
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la venta
 *     responses:
 *       200:
 *         description: Venta completada exitosamente
 *       404:
 *         description: Venta no encontrada
 */
router.put("/:id/completar", putVentaCompletar);

export default router;