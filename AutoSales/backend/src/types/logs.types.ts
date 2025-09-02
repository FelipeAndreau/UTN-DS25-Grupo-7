// src/types/logs.types.ts

export interface LogEvento {
  id: string;
  tipo: "CREAR_RESERVA" | "ACTUALIZAR_RESERVA" | "CANCELAR_RESERVA" | "PAGO_APLICADO" | "ERROR_VALIDACION" | "CORRECCION";
  timestampISO: string;
  actor: {
    tipo: "CLIENTE" | "SISTEMA" | "ADMIN";
    id: string;
    nombre?: string;
  };
  contexto: {
    clienteId: string;
    reservaId?: string;
    servicioId?: string;
    fecha?: string;
    hora?: string;
    estado?: "pendiente" | "confirmada" | "cancelada";
    ventas?: {
      monto?: number;
      moneda?: string;
      medio?: string;
      referencia?: string;
    };
  };
  mensaje: string;
}

export interface ReservaClienteView {
  codigoReserva: string;
  servicio: string;
  fecha: string;
  hora: string;
  estado: "pendiente" | "confirmada" | "cancelada";
  monto?: number;
  moneda?: string;
  accionesDisponibles: string[];
}
