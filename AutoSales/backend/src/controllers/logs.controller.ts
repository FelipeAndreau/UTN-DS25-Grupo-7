// src/controllers/logs.controller.ts

import { Request, Response } from "express";
import { LogsService } from "../services/logs.service";

export const getLogs = async (req: Request, res: Response) => {
  try {
    const { tipo, clienteId, reservaId } = req.query;
    
    let logs;
    
    if (reservaId) {
      logs = LogsService.obtenerLogsPorReserva(reservaId as string);
    } else if (clienteId) {
      logs = LogsService.obtenerLogsPorCliente(clienteId as string);
    } else if (tipo) {
      logs = LogsService.obtenerLogsPorTipo(tipo as any);
    } else {
      logs = LogsService.obtenerTodosLosLogs();
    }

    res.json({
      success: true,
      message: "Logs obtenidos exitosamente",
      logs: logs,
      data: logs, // Para compatibilidad
      count: logs.length
    });
  } catch (error: any) {
    console.error("❌ Error obteniendo logs:", error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Error interno del servidor" 
    });
  }
};

export const getLogStats = async (req: Request, res: Response) => {
  try {
    const todosLosLogs = LogsService.obtenerTodosLosLogs();
    
    const stats = {
      total: todosLosLogs.length,
      porTipo: {
        CREAR_RESERVA: LogsService.obtenerLogsPorTipo("CREAR_RESERVA").length,
        CANCELAR_RESERVA: LogsService.obtenerLogsPorTipo("CANCELAR_RESERVA").length,
        ACTUALIZAR_RESERVA: LogsService.obtenerLogsPorTipo("ACTUALIZAR_RESERVA").length,
        PAGO_APLICADO: LogsService.obtenerLogsPorTipo("PAGO_APLICADO").length,
        ERROR_VALIDACION: LogsService.obtenerLogsPorTipo("ERROR_VALIDACION").length,
        CORRECCION: LogsService.obtenerLogsPorTipo("CORRECCION").length
      },
      ultimaActividad: todosLosLogs.length > 0 ? todosLosLogs[todosLosLogs.length - 1].timestampISO : null
    };

    res.json({
      success: true,
      message: "Estadísticas de logs obtenidas exitosamente",
      data: stats
    });
  } catch (error: any) {
    console.error("❌ Error obteniendo estadísticas de logs:", error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Error interno del servidor" 
    });
  }
};