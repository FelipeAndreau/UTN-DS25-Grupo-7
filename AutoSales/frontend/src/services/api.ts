const API_URL = 'http://localhost:3000';

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
    
    const response = await fetch(input, { ...init, headers });
    
    if (response.status === 401) {
        authService.logout();
        throw new Error('Sesión expirada');
    }
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error en la petición');
    }
    
    return response;
};

// Servicios de Ventas
export const ventasService = {
    getAll: async (): Promise<Venta[]> => {
        const response = await fetchWithAuth(`${API_URL}/ventas`);
        return response.json();
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
    getAll: async (): Promise<Vehiculo[]> => {
        const response = await fetchWithAuth(`${API_URL}/vehiculos`);
        return response.json();
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
