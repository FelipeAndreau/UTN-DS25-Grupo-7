// src/routes/vehiculos.routes.ts

import { Router } from "express";
import {
  getVehiculos,
  postVehiculo,
  putVehiculo,
  deleteVehiculo,
} from "../controllers/vehiculos.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/requireRoleMiddleware";
import { createVehiculoSchema, updateVehiculoSchema } from "../validations/vehiculo.validation";
import { validate } from "../middlewares/validation.middleware";
const router = Router();

/**
 * @swagger
 * /api/public/vehiculos:
 *   get:
 *     summary: Obtener todos los vehículos (acceso público)
 *     tags: [Vehículos Públicos]
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [Disponible, Reservado, Vendido]
 *       - in: query
 *         name: marca
 *         schema:
 *           type: string
 *       - in: query
 *         name: modelo
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrecio
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrecio
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Lista pública de vehículos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehiculo'
 */
// Ruta pública para obtener vehículos (sin autenticación)
router.get("/", getVehiculos);

/**
 * @swagger
 * /api/vehiculos/admin:
 *   get:
 *     summary: Obtener todos los vehículos (solo usuarios autenticados)
 *     tags: [Vehículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [Disponible, Reservado, Vendido]
 *       - in: query
 *         name: marca
 *         schema:
 *           type: string
 *       - in: query
 *         name: anio
 *         schema:
 *           type: integer
 *       - in: query
 *         name: minPrecio
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrecio
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Lista de vehículos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehiculo'
 *       401:
 *         description: No autorizado
 */
router.get("/admin", authMiddleware, requireRole(["admin"]), getVehiculos); // Solo admin

/**
 * @swagger
 * /api/vehiculos/viewer:
 *   get:
 *     summary: Obtener todos los vehículos (para usuarios viewer)
 *     tags: [Vehículos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de vehículos para usuarios viewer
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehiculo'
 *       401:
 *         description: No autorizado
 */
router.get("/viewer", authMiddleware, requireRole(["viewer", "admin"]), getVehiculos); // Para viewer y admin

/**
 * @swagger
 * /api/vehiculos:
 *   post:
 *     summary: Crear un nuevo vehículo (solo admin)
 *     tags: [Vehículos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vehiculo'
 *     responses:
 *       201:
 *         description: Vehículo creado exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permisos insuficientes
 */
router.post("/", authMiddleware, requireRole(["admin"]), validate(createVehiculoSchema), postVehiculo);

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   put:
 *     summary: Actualizar un vehículo (solo admin)
 *     tags: [Vehículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vehiculo'
 *     responses:
 *       200:
 *         description: Vehículo actualizado exitosamente
 *       404:
 *         description: Vehículo no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permisos insuficientes
 */
router.put("/:id", authMiddleware, requireRole(["admin"]), validate(updateVehiculoSchema), putVehiculo);

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   delete:
 *     summary: Eliminar un vehículo (solo admin)
 *     tags: [Vehículos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vehículo eliminado exitosamente
 *       404:
 *         description: Vehículo no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permisos insuficientes
 */
router.delete("/:id", authMiddleware, requireRole(["admin"]), deleteVehiculo);

export default router;