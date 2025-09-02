// src/services/logs.service.ts
import { LogEvento } from "../types/logs.types";

// Función simple para generar IDs únicos
const generarId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Array en memoria para almacenar los logs (append-only)
const logEventos: LogEvento[] = [];

export class LogsService {
  
  /**
   * Crea un nuevo log de evento
   */
  static crearLog(
    tipo: LogEvento["tipo"],
    actor: LogEvento["actor"],
    contexto: LogEvento["contexto"],
    mensaje: string
  ): LogEvento {
    const logEvento: LogEvento = {
      id: generarId(),
      tipo,
      timestampISO: new Date().toISOString(),
      actor,
      contexto,
      mensaje
    };

    // Append-only: agregar al final del array
    logEventos.push(logEvento);
    
    console.log(`📊 LOG [${tipo}]: ${mensaje}`);
    
    return logEvento;
  }

  /**
   * Obtiene todos los logs (para Admin → Reportes)
   */
  static obtenerTodosLosLogs(): LogEvento[] {
    return [...logEventos]; // Retorna copia para evitar mutaciones
  }

  /**
   * Obtiene logs filtrados por tipo
   */
  static obtenerLogsPorTipo(tipo: LogEvento["tipo"]): LogEvento[] {
    return logEventos.filter(log => log.tipo === tipo);
  }

  /**
   * Obtiene logs de un cliente específico
   */
  static obtenerLogsPorCliente(clienteId: string): LogEvento[] {
    return logEventos.filter(log => log.contexto.clienteId === clienteId);
  }

  /**
   * Obtiene logs de una reserva específica
   */
  static obtenerLogsPorReserva(reservaId: string): LogEvento[] {
    return logEventos.filter(log => log.contexto.reservaId === reservaId);
  }

  // Métodos helper para tipos específicos de logs

  static logCrearReserva(
    clienteId: string,
    clienteNombre: string,
    reservaId: string,
    vehiculoId: string,
    fecha: string,
    estado: "pendiente" | "confirmada" | "cancelada"
  ): LogEvento {
    return this.crearLog(
      "CREAR_RESERVA",
      { tipo: "CLIENTE", id: clienteId, nombre: clienteNombre },
      { 
        clienteId, 
        reservaId, 
        servicioId: vehiculoId, 
        fecha: fecha.split('T')[0], 
        hora: fecha.split('T')[1]?.split('.')[0] || "00:00",
        estado 
      },
      `Reserva creada para ${clienteNombre} (ID ${clienteId}) — Vehículo ${vehiculoId} el ${fecha.split('T')[0]} a las ${fecha.split('T')[1]?.split('.')[0] || "00:00"}. Estado: ${estado}.`
    );
  }

  static logCancelarReserva(
    actorTipo: "CLIENTE" | "ADMIN",
    actorId: string,
    actorNombre: string,
    reservaId: string,
    clienteId: string,
    motivo?: string
  ): LogEvento {
    return this.crearLog(
      "CANCELAR_RESERVA",
      { tipo: actorTipo, id: actorId, nombre: actorNombre },
      { clienteId, reservaId, estado: "cancelada" },
      `Reserva ${reservaId} cancelada por ${actorNombre} (${actorTipo}). ${motivo ? `Motivo: ${motivo}.` : ""}`
    );
  }

  static logErrorValidacion(
    clienteId: string,
    detalle: string,
    camposFaltantes: string[]
  ): LogEvento {
    return this.crearLog(
      "ERROR_VALIDACION",
      { tipo: "SISTEMA", id: "sistema" },
      { clienteId },
      `Error al crear reserva: ${detalle}. Campos faltantes: ${camposFaltantes.join(", ")}.`
    );
  }

  static logActualizarReserva(
    actorTipo: "CLIENTE" | "ADMIN",
    actorId: string,
    actorNombre: string,
    reservaId: string,
    clienteId: string,
    cambios: string
  ): LogEvento {
    return this.crearLog(
      "ACTUALIZAR_RESERVA",
      { tipo: actorTipo, id: actorId, nombre: actorNombre },
      { clienteId, reservaId },
      `Reserva ${reservaId} actualizada por ${actorNombre}. Cambios: ${cambios}.`
    );
  }
}

export { logEventos };
