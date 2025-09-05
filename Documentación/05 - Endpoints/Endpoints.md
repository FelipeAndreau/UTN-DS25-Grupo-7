# 📘 Endpoints por Pantalla

A continuación se detalla la documentación de los endpoints utilizados por cada pantalla, sus métodos, reglas de negocio, autenticación y las interfaces de datos utilizadas.

---

## 1. **Login.tsx**

| Endpoint           | Método | URL          | Regla de Negocio                        | Auth |
|--------------------|--------|--------------|-----------------------------------------|------|
| Inicio de sesión   | POST   | `/auth/login`| Verifica credenciales y entrega token   | ❌   |

**Interfaces:**
```typescript
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: { id: string; rol: string; nombre: string };
}
```

---

## 2. **Dashboard.tsx**

| Endpoint            | Método | URL                | Regla de Negocio         | Auth |
|---------------------|--------|--------------------|--------------------------|------|
| Obtener métricas    | GET    | `/dashboard/stats` | Devuelve KPIs globales   | ✅   |

**Interfaz:**
```typescript
interface DashboardResponse {
  totalClientes: number;
  totalVehiculos: number;
  ventasMensuales: number[];
  clientesPorEstado: Record<string, number>;
  vehiculosPorEstado: Record<string, number>;
}
```

---

## 3. **GestionClientes.tsx**

| Endpoint         | Método | URL             | Regla de Negocio                 | Auth |
|------------------|--------|-----------------|----------------------------------|------|
| Listar clientes  | GET    | `/clientes`     | Permite filtrar por nombre, tipo o estado | ✅ |
| Crear cliente    | POST   | `/clientes`     | Valida campos obligatorios       | ✅   |
| Editar cliente   | PUT    | `/clientes/:id` | Actualiza datos por ID           | ✅   |
| Eliminar cliente | DELETE | `/clientes/:id` | Elimina por ID                   | ✅   |

**Interfaces:**
```typescript
interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  tipo: "Particular" | "Empresa";
  estado: "Activo" | "En proceso" | "Financiamiento" | "Potencial";
  actividad: string;
}

type ClienteRequest = Omit<Cliente, "id">;
type ClienteResponse = Cliente[];
```

---

## 4. **GestionVehiculos.tsx**

| Endpoint           | Método | URL                | Regla de Negocio                         | Auth |
|--------------------|--------|--------------------|------------------------------------------|------|
| Listar vehículos   | GET    | `/vehiculos`       | Permite filtrar por estado, marca o modelo | ✅ |
| Crear vehículo     | POST   | `/vehiculos`       | Valida imagen, año y datos               | ✅   |
| Editar vehículo    | PUT    | `/vehiculos/:id`   | Actualiza campos existentes              | ✅   |
| Eliminar vehículo  | DELETE | `/vehiculos/:id`   | Borra vehículo por ID                    | ✅   |

**Interfaces:**
```typescript
interface Vehiculo {
  id: number;
  marca: string;
  modelo: string;
  anio: number;
  precio: number;
  estado: "Disponible" | "Reservado" | "Vendido";
  imagen: string;
  descripcion: string;
}

type VehiculoRequest = Omit<Vehiculo, "id">;
type VehiculoResponse = Vehiculo[];
```

---
