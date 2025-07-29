## 🧭 RESUMEN:
1. **IDENTIFICAR ENDPOINTS POR PANTALLA**
2. **DEFINIR CADA ENDPOINT**
   - Método HTTP
   - URL
   - Reglas de negocio
   - Autenticación requerida (✅ / ❌)
3. **INTERFACES TYPESCRIPT PARA REQUEST/RESPONSE**

---

## 📘 ENDPOINTS POR PANTALLA

### 1. **Login.tsx**
| Endpoint | Método | URL | Regla de negocio | Auth |
|---------|--------|-----|------------------|------|
| Inicio de sesión | `POST` | `/auth/login` | Verifica credenciales y entrega token | ❌ |

**INTERFACES:**
```ts
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

### 2. **Dashboard.tsx**
| Endpoint | Método | URL | Regla de negocio | Auth |
|---------|--------|-----|------------------|------|
| Obtener métricas | `GET` | `/dashboard/stats` | Devuelve KPIs globales | ✅ |

**INTERFAZ:**
```ts
interface DashboardResponse {
  totalClientes: number;
  totalVehiculos: number;
  ventasMensuales: number[];
}
```

---

### 3. **GestionClientes.tsx**
| Endpoint | Método | URL | Regla de negocio | Auth |
|---------|--------|-----|------------------|------|
| Listar clientes | `GET` | `/clientes` | Permite filtrar por nombre, tipo o estado | ✅ |
| Crear cliente | `POST` | `/clientes` | Valida campos obligatorios | ✅ |
| Editar cliente | `PUT` | `/clientes/:id` | Actualiza datos por ID | ✅ |
| Eliminar cliente | `DELETE` | `/clientes/:id` | Elimina por ID | ✅ |

**INTERFACES:**
```ts
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

### 4. **GestionVehiculos.tsx**
| Endpoint | Método | URL | Regla de negocio | Auth |
|---------|--------|-----|------------------|------|
| Listar vehículos | `GET` | `/vehiculos` | Permite filtrar por estado, marca o modelo | ✅ |
| Crear vehículo | `POST` | `/vehiculos` | Valida imagen, año, y datos | ✅ |
| Editar vehículo | `PUT` | `/vehiculos/:id` | Actualiza campos existentes | ✅ |
| Eliminar vehículo | `DELETE` | `/vehiculos/:id` | Borra vehículo por ID | ✅ |

**INTERFACES:**
```ts
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

### 5. **GestionUsuarios.tsx**
| Endpoint | Método | URL | Regla de negocio | Auth |
|---------|--------|-----|------------------|------|
| Listar usuarios | `GET` | `/usuarios` | Admins solamente | ✅ |
| Crear usuario | `POST` | `/usuarios` | Validar email único | ✅ |
| Editar usuario | `PUT` | `/usuarios/:id` | Cambiar rol o datos | ✅ |
| Eliminar usuario | `DELETE` | `/usuarios/:id` | Soft-delete | ✅ |

**INTERFACES:**
```ts
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

### 6. **Reportes.tsx**
| Endpoint | Método | URL | Regla de negocio | Auth |
|---------|--------|-----|------------------|------|
| Generar reporte | `GET` | `/reportes?mes=7&tipo=ventas` | KPIs por mes/segmento | ✅ |

**INTERFAZ:**

```ts
interface ReporteResponse {
  mes: string;
  tipo: string;
  total: number;
  grafico: number[];
}
```

---

### 7. **Configuracion.tsx**
| Endpoint | Método | URL | Regla de negocio | Auth |
|---------|--------|-----|------------------|------|
| Obtener config | `GET` | `/config` | Preferencias UI, temas, etc. | ✅ |
| Actualizar config | `PUT` | `/config` | Guarda preferencias por usuario | ✅ |

**INTERFAZ:**

```ts
interface Config {
  idioma: string;
  tema: "claro" | "oscuro";
  notificaciones: boolean;
}
```

---

## 🔐 AUTENTICACIÓN
Todos los endpoints excepto `/auth/login` deben protegerse con JWT en los headers (`Authorization: Bearer <token>`). Se puede usar middleware tipo `authMiddleware` en Express para validar acceso.

---
