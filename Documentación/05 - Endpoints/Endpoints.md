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

## 5. **GestionUsuarios.tsx**

| Endpoint          | Método | URL              | Regla de Negocio               | Auth |
|-------------------|--------|------------------|--------------------------------|------|
| Listar usuarios   | GET    | `/usuarios`      | Admins solamente               | ✅   |
| Crear usuario     | POST   | `/usuarios`      | Validar email único            | ✅   |
| Editar usuario    | PUT    | `/usuarios/:id`  | Cambiar rol o datos            | ✅   |
| Eliminar usuario  | DELETE | `/usuarios/:id`  | Soft-delete                    | ✅   |

**Interfaces:**
```typescript
interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: "admin" | "vendedor" | "viewer";
}

type UsuarioRequest = Omit<Usuario, "id">;
type UsuarioResponse = Usuario[];
```

---

## 6. **Reportes.tsx**

| Endpoint              | Método | URL                                   | Regla de Negocio        | Auth |
|-----------------------|--------|---------------------------------------|-------------------------|------|
| Reporte de ventas     | GET    | `/reportes/ventas?mes=7`              | KPIs mensuales          | ✅   |
| Reporte de clientes   | GET    | `/reportes/clientes?mes=7`            | Nuevos clientes por mes | ✅   |
| Reporte de vehículos  | GET    | `/reportes/vehiculos?mes=7`           | Vehículos vendidos por mes | ✅ |

**Interfaz:**
```typescript
interface ReporteResponse {
  mes: string;
  tipo: "ventas" | "clientes" | "vehiculos";
  total: number;
  grafico: number[];
}
```

---

## 7. **Configuracion.tsx**

| Endpoint         | Método | URL         | Regla de Negocio                | Auth |
|------------------|--------|-------------|---------------------------------|------|
| Obtener config   | GET    | `/config`   | Preferencias UI, temas, etc.    | ✅   |
| Actualizar config| PUT    | `/config`   | Guarda preferencias por usuario | ✅   |

**Interfaz:**
```typescript
interface Config {
  idioma: string;
  tema: "claro" | "oscuro";
  notificaciones: boolean;
}
```

---

## 🔐 Autenticación

Todos los endpoints excepto `/auth/login` deben protegerse con JWT en los headers:

```
Authorization: Bearer <token>
```

Se recomienda el uso de un middleware tipo `authMiddleware` en Express para validar el acceso.

---
