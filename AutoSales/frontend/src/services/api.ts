// Configuración dinámica de la API URL
// Configuración dinámica de la API URL
const getApiUrl = (): string => {
  // En desarrollo
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  }
  
  // En producción - URL fija para evitar problemas con variables de entorno
  return 'https://utn-ds25-grupo-7-apej.onrender.com/api';
};

const API_URL = getApiUrl();

// Auth
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: string;
        rol: string;
        nombre: string;
    };
}

export const authService = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        });
        
        if (!response.ok) {
            throw new Error('Error en el login');
        }
        
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    },

    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};

// Interfaces
export interface Usuario {
    id?: string;
    nombre: string;
    email: string;
    password?: string;
    rol: 'admin' | 'viewer';
    activo?: boolean;
    creadoEn?: string;
    actualizadoEn?: string;
}

export interface Cliente {
    id?: string;
    nombre: string;
    email: string;
    telefono: string;
    tipo: 'Particular' | 'Empresa';
    estado: 'Activo' | 'En_proceso' | 'Financiamiento' | 'Potencial';
    actividad: string;
    usuarioId?: string;
    creadoEn?: string;
    actualizadoEn?: string;
}

export interface Vehiculo {
    id?: number;
    marca: string;
    modelo: string;
    anio: number;
    precio: number;
    estado: 'Disponible' | 'Reservado' | 'Vendido';
    imagen: string;
    descripcion: string;
    creadoEn?: string;
    actualizadoEn?: string;
}

export interface Venta {
    id?: number;
    clienteId: string;
    vehiculoId: number;
    fecha: string;
    monto: number;
    creadoEn?: string;
    actualizadoEn?: string;
    cliente?: Cliente;
    vehiculo?: Vehiculo;
}

export interface Reserva {
    id: number;
    clienteId: string;
    vehiculoId: number;
    fecha: string;
    fechaVisita?: string | null;
    fechaVencimiento?: string;
    estado: string;
    notas?: string;
    creadoEn?: string;
    actualizadoEn?: string;
    cliente?: {
        id: string;
        nombre: string;
        apellido?: string;
        email: string;
        telefono: string;
    };
    vehiculo?: {
        id: number;
        marca: string;
        modelo: string;
        anio: number;
        precio: number;
        estado: string;
        imagen?: string;
    };
}

export interface DashboardStats {
    totalClientes: number;
    totalVehiculos: number;
    ventasMensuales: number[];
    clientesPorEstado: Record<string, number>;
    vehiculosPorEstado: Record<string, number>;
}

// Helper function for authenticated requests
const fetchWithAuth = async (input: RequestInfo, init?: RequestInit) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init?.headers || {})
    };
    
    try {
        const response = await fetch(input, { ...init, headers });
        
        if (response.status === 401) {
            authService.logout();
            throw new Error('Sesión expirada');
        }
        
        if (!response.ok) {
            let errorMessage = 'Error en la petición';
            
            try {
                // Intentar leer como JSON primero
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch {
                // Si no es JSON, leer como texto
                try {
                    const errorText = await response.text();
                    errorMessage = errorText || errorMessage;
                } catch {
                    // Si tampoco se puede leer como texto, usar mensaje por defecto
                    errorMessage = `Error ${response.status}: ${response.statusText}`;
                }
            }
            
            console.error(`API Error [${response.status}]:`, errorMessage);
            throw new Error(errorMessage);
        }
        
        return response;
    } catch (error) {
        console.error('Network/Fetch Error:', error);
        throw error;
    }
};

// Servicios de Ventas
export const ventasService = {
    // Endpoint público (sin autenticación) para catálogo
    getAllPublic: async (): Promise<Venta[]> => {
        try {
            const response = await fetch(`${API_URL}/public/ventas`);
            if (!response.ok) {
                throw new Error('Error al obtener ventas');
            }
            const data = await response.json();
            return data.data || data; // Maneja tanto el formato nuevo como el antiguo
        } catch (error) {
            console.error('Error fetching ventas:', error);
            throw error;
        }
    },

    // Endpoint privado (con autenticación) para administradores
    getAll: async (): Promise<Venta[]> => {
        const response = await fetchWithAuth(`${API_URL}/ventas`);
        const data = await response.json();
        return data.data || data; // Maneja tanto el formato nuevo como el antiguo
    },

    create: async (venta: Omit<Venta, 'id' | 'creadoEn' | 'actualizadoEn'>): Promise<void> => {
        console.log('🚀 Datos enviados al backend para crear venta:', venta);
        await fetchWithAuth(`${API_URL}/ventas`, {
            method: 'POST',
            body: JSON.stringify(venta)
        });
    },

    update: async (id: number, venta: Partial<Venta>): Promise<void> => {
        await fetchWithAuth(`${API_URL}/ventas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(venta)
        });
    },

    delete: async (id: number): Promise<void> => {
        await fetchWithAuth(`${API_URL}/ventas/${id}`, {
            method: 'DELETE'
        });
    }
};

// Servicios de Clientes
export const clientesService = {
    getAll: async (): Promise<Cliente[]> => {
        const response = await fetchWithAuth(`${API_URL}/clientes`);
        return response.json();
    },

    create: async (cliente: Omit<Cliente, 'id' | 'creadoEn' | 'actualizadoEn'>): Promise<void> => {
        await fetchWithAuth(`${API_URL}/clientes`, {
            method: 'POST',
            body: JSON.stringify(cliente)
        });
    },

    update: async (id: string, cliente: Partial<Cliente>): Promise<void> => {
        await fetchWithAuth(`${API_URL}/clientes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(cliente)
        });
    },

    delete: async (id: string): Promise<void> => {
        await fetchWithAuth(`${API_URL}/clientes/${id}`, {
            method: 'DELETE'
        });
    }
};

// Servicios de Vehículos
export const vehiculosService = {
    // Endpoint público (sin autenticación) para catálogo de clientes
    getAllPublic: async (): Promise<Vehiculo[]> => {
        try {
            const response = await fetch(`${API_URL}/public/vehiculos`);
            if (!response.ok) {
                throw new Error('Error al obtener vehículos');
            }
            const data = await response.json();
            return data.data || data; // Maneja tanto el formato nuevo como el antiguo
        } catch (error) {
            console.error('Error fetching vehiculos:', error);
            throw error;
        }
    },

    // Usar endpoint público que SÍ FUNCIONA
    getAll: async (): Promise<Vehiculo[]> => {
        const user = authService.getUser();
        console.log('🔍 Usuario obtenido:', user);
        
        // Usar siempre el endpoint público que sabemos que funciona
        const endpoint = `${API_URL}/public/vehiculos`;
        
        console.log('🚀 Llamando endpoint público:', endpoint);
        
        try {
            // Usar fetch normal sin autenticación porque es endpoint público
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Respuesta del servidor:', data);
            return data.data || data; // Maneja tanto el formato nuevo como el antiguo
        } catch (error) {
            console.error('❌ Error en vehiculosService.getAll:', error);
            throw error;
        }
    },

    create: async (vehiculo: Omit<Vehiculo, 'id' | 'creadoEn' | 'actualizadoEn'>): Promise<void> => {
        await fetchWithAuth(`${API_URL}/vehiculos`, {
            method: 'POST',
            body: JSON.stringify(vehiculo)
        });
    },

    update: async (id: number, vehiculo: Partial<Vehiculo>): Promise<void> => {
        await fetchWithAuth(`${API_URL}/vehiculos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(vehiculo)
        });
    },

    delete: async (id: number): Promise<void> => {
        await fetchWithAuth(`${API_URL}/vehiculos/${id}`, {
            method: 'DELETE'
        });
    }
};

// Servicios de Dashboard
export const dashboardService = {
    getStats: async (): Promise<DashboardStats> => {
        const response = await fetchWithAuth(`${API_URL}/dashboard/stats`);
        return response.json();
    }
};

// Exportaciones legacy para compatibilidad
export const getVentas = ventasService.getAll;
export const createVenta = ventasService.create;
export const updateVenta = ventasService.update;
export const deleteVenta = ventasService.delete;

// Legacy car interface para compatibilidad
export interface Car {
    id?: number;
    make: string;
    model: string;
    year: number;
    price: number;
    description: string;
    imageUrl?: string;
    isAvailable: boolean;
}

// Servicios de Usuarios
export const usuariosService = {
    getAll: async (): Promise<Usuario[]> => {
        const response = await fetchWithAuth(`${API_URL}/usuarios`);
        return response.json();
    },

    create: async (usuario: Omit<Usuario, 'id' | 'creadoEn' | 'actualizadoEn'>): Promise<void> => {
        await fetchWithAuth(`${API_URL}/usuarios`, {
            method: 'POST',
            body: JSON.stringify(usuario)
        });
    },

    update: async (id: string, usuario: Partial<Usuario>): Promise<void> => {
        await fetchWithAuth(`${API_URL}/usuarios/${id}`, {
            method: 'PUT',
            body: JSON.stringify(usuario)
        });
    },

    delete: async (id: string): Promise<void> => {
        await fetchWithAuth(`${API_URL}/usuarios/${id}`, {
            method: 'DELETE'
        });
    }
};

export const carService = {
    getAllCars: async (): Promise<Car[]> => {
        // Mapear vehículos a formato Car para compatibilidad
        const vehiculos = await vehiculosService.getAll();
        return vehiculos.map(v => ({
            id: v.id,
            make: v.marca,
            model: v.modelo,
            year: v.anio,
            price: v.precio,
            description: v.descripcion,
            imageUrl: v.imagen,
            isAvailable: v.estado === 'Disponible'
        }));
    },

    getCarById: async (id: number): Promise<Car> => {
        const vehiculos = await vehiculosService.getAll();
        const vehiculo = vehiculos.find(v => v.id === id);
        if (!vehiculo) throw new Error('Vehículo no encontrado');
        
        return {
            id: vehiculo.id,
            make: vehiculo.marca,
            model: vehiculo.modelo,
            year: vehiculo.anio,
            price: vehiculo.precio,
            description: vehiculo.descripcion,
            imageUrl: vehiculo.imagen,
            isAvailable: vehiculo.estado === 'Disponible'
        };
    },

    createCar: async (car: Car): Promise<Car> => {
        const vehiculo: Omit<Vehiculo, 'id' | 'creadoEn' | 'actualizadoEn'> = {
            marca: car.make,
            modelo: car.model,
            anio: car.year,
            precio: car.price,
            descripcion: car.description,
            imagen: car.imageUrl || '',
            estado: car.isAvailable ? 'Disponible' : 'Vendido'
        };
        
        await vehiculosService.create(vehiculo);
        return car;
    },

    searchCars: async (query: string): Promise<Car[]> => {
        const cars = await carService.getAllCars();
        return cars.filter(car => 
            car.make.toLowerCase().includes(query.toLowerCase()) ||
            car.model.toLowerCase().includes(query.toLowerCase()) ||
            car.description.toLowerCase().includes(query.toLowerCase())
        );
    }
};

// Servicios de Reservas

export interface CreateReservaRequest {
    clienteId?: string;
    vehiculoId: number;
    fechaVisita?: string; // Fecha de visita al concesionario
    fechaVencimiento?: string;
    notas?: string;
}

export const reservasService = {
    // Obtener todas las reservas (solo admin)
    getAll: async (): Promise<Reserva[]> => {
        const response = await fetchWithAuth(`${API_URL}/reservas`);
        return response.json();
    },

    // Obtener reservas de un cliente específico
    getByCliente: async (clienteId: string): Promise<Reserva[]> => {
        const response = await fetchWithAuth(`${API_URL}/reservas/cliente/${clienteId}`);
        const result = await response.json();
        
        // Manejar respuesta del backend que puede ser un objeto con data o un array directo
        if (result && result.data && Array.isArray(result.data)) {
            return result.data;
        } else if (Array.isArray(result)) {
            return result;
        } else {
            console.warn('Respuesta inesperada de getByCliente:', result);
            return [];
        }
    },

    // Obtener reservas del usuario autenticado
    getMisReservas: async (): Promise<Reserva[]> => {
        console.log('🔍 Obteniendo mis reservas...');
        console.log('🔑 Token disponible:', !!localStorage.getItem('token'));
        console.log('👤 Usuario:', authService.getUser());
        
        try {
            const response = await fetchWithAuth(`${API_URL}/reservas/mis-reservas`);
            const result = await response.json();
            console.log('✅ Respuesta de mis reservas:', result);
            
            // Manejar respuesta del backend que puede ser un objeto con data o un array directo
            if (result && result.data && Array.isArray(result.data)) {
                return result.data;
            } else if (Array.isArray(result)) {
                return result;
            } else {
                console.warn('Respuesta inesperada de getMisReservas:', result);
                return [];
            }
        } catch (error) {
            console.error('❌ Error en reservasService.getMisReservas:', error);
            throw error;
        }
    },

    // Crear nueva reserva (SIN autenticación - ruta pública)
    createPublic: async (vehiculoId: number, clienteInfo?: { 
        id?: string; 
        nombre?: string; 
        email?: string; 
        telefono?: string; 
        fechaVisita?: string; 
    }): Promise<Reserva> => {
        const body: any = { vehiculoId };
        
        // Si se proporciona información del cliente, incluirla
        if (clienteInfo) {
            if (clienteInfo.id) body.clienteId = clienteInfo.id;
            if (clienteInfo.nombre) body.nombre = clienteInfo.nombre;
            if (clienteInfo.email) body.email = clienteInfo.email;
            if (clienteInfo.telefono) body.telefono = clienteInfo.telefono;
            if (clienteInfo.fechaVisita) body.fechaVisita = clienteInfo.fechaVisita;
        }

        const response = await fetch(`${API_URL}/public/reservas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });
        
        if (!response.ok) {
            throw new Error('Error al crear la reserva');
        }
        
        const result = await response.json();
        return result.data || result;
    },

    // Crear nueva reserva (con autenticación)
    create: async (reserva: CreateReservaRequest): Promise<Reserva> => {
        const response = await fetchWithAuth(`${API_URL}/reservas/crear`, {
            method: 'POST',
            body: JSON.stringify(reserva)
        });
        return response.json();
    },

    // Cancelar reserva
    cancel: async (id: number | string): Promise<void> => {
        await fetchWithAuth(`${API_URL}/reservas/${id}/cancelar`, {
            method: 'PATCH'
        });
    },

    // Eliminar reserva (solo admin)
    delete: async (id: string): Promise<void> => {
        await fetchWithAuth(`${API_URL}/reservas/${id}`, {
            method: 'DELETE'
        });
    }
};

// Interfaces para Logs
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

// Servicios de Logs
export const logsService = {
    // Obtener todos los logs (solo admin)
    getAll: async (): Promise<LogEvento[]> => {
        const response = await fetchWithAuth(`${API_URL}/logs`);
        const data = await response.json();
        return data.logs || data.data || [];
    },

    // Obtener estadísticas de logs (solo admin)
    getStats: async (): Promise<any> => {
        const response = await fetchWithAuth(`${API_URL}/logs/stats`);
        return response.json();
    }
};
