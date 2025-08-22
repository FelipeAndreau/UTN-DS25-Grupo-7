// src/controllers/reservas.controller.ts
import { Request, Response } from "express"
import * as reservaService from "../services/reservas.service"

export const crearReserva = async (req: Request, res: Response) => {
  try {
    const nueva = await reservaService.crearReserva(req.body)
    res.status(201).json(nueva)
  } catch (err) {
    res.status(500).json({ error: "Error al crear la reserva" })
  }
}

export const listarReservasAdmin = async (_req: Request, res: Response) => {
  try {
    const reservas = await reservaService.listarReservasAdmin()
    res.json(reservas)
  } catch (err) {
    res.status(500).json({ error: "Error al obtener las reservas" })
  }
}

export const listarReservasCliente = async (req: Request, res: Response) => {
  try {
    const clienteId = (req.params.clienteId)
    const reservas = await reservaService.listarReservasCliente(clienteId)
    res.json(reservas)
  } catch (err) {
    res.status(500).json({ error: "Error al obtener las reservas del cliente" })
  }
}

export const cancelarReserva = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const reservaCancelada = await reservaService.cancelarReserva(Number(id))
    res.json(reservaCancelada)
  } catch (err) {
    res.status(500).json({ error: "Error al cancelar la reserva" })
  }
}