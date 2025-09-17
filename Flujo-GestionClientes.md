# Flujo: **Gestión de Clientes**

## 1) Frontend (UI, validaciones, request)

**Entrada:** 
- Admin accede a la sección "Gestión de Clientes" desde el Dashboard
- Formulario con campos: `nombre`, `email`, `telefono`, `tipo`, `estado`, `actividad`
- Estados del componente: `clientes[]`, `nuevoCliente`, `clienteSeleccionado`, `modalTipo`, `loading`, `error`

**Proceso:**
- Carga inicial: `useEffect` ejecuta `cargarClientes()` al montar componente
- Validaciones client-side: campos requeridos (nombre, email, telefono), formato email
- Filtros dinámicos por texto, estado y tipo de cliente
- Operaciones CRUD: crear, leer, actualizar, eliminar clientes
- Manejo de modales para ver/editar cliente individual

**Salida:**
- GET `/api/clientes` para listar todos los clientes
- POST `/api/clientes` para crear nuevo cliente
- PUT `/api/clientes/{id}` para actualizar cliente existente
- DELETE `/api/clientes/{id}` para eliminar cliente

**Posibles errores:**
- Campos obligatorios vacíos → "Nombre/Email/Teléfono es requerido"
- Email duplicado → "El email ya está registrado"
- Formato de email inválido → "Ingrese un email válido"
- Error de red → "No se pudo conectar con el servidor"

## 2) Middleware/HTTP (headers, cookies)

**Entrada:**
- Requests con autenticación: header `Authorization: Bearer {jwt_token}`
- Content-Type: `application/json` para POST/PUT
- Accept: `application/json`

**Proceso:**
- CORS middleware permite origen del frontend
- `express.json()` parsea cuerpos de requests POST/PUT
- `authMiddleware` valida JWT token en todas las rutas de clientes
- Verificación de rol admin para operaciones de escritura (CREATE, UPDATE, DELETE)

**Salida:**
- Request autenticado con `req.user` disponible
- Headers CORS añadidos para cross-origin requests
- Body parseado disponible en `req.body`

**Posibles errores:**
- Token ausente/inválido → 401 "No autorizado"
- Token expirado → 403 "Token expirado"
- Rol insuficiente → 403 "Acceso denegado - requiere rol admin"
- CORS policy → bloqueo de origen no permitido

## 3) Backend: Controller → Service → ORM

### Controller (`clientes.controller.ts`)

**Entrada:**
- Request autenticado con usuario admin
- Parámetros de ruta (ID cliente) y body data según operación

**Proceso:**
- `getClientes()`: listar todos los clientes sin parámetros
- `postCliente()`: crear cliente con validación de datos requeridos
- `putCliente()`: actualizar cliente existente por ID
- `deleteCliente()`: eliminación lógica o física del cliente

**Salida:**
- Respuesta JSON con datos del cliente o lista de clientes
- Status codes apropiados: 200 (éxito), 201 (creado), 204 (eliminado)

**Posibles errores:**
- ID inválido → 400 "ID de cliente inválido"
- Cliente no encontrado → 404 "Cliente no encontrado"
- Datos inválidos → 400 "Datos del cliente inválidos"

### Service (`clientes.service.ts`)

**Entrada:**
- Datos del cliente y operación a realizar
- Funciones: `listarClientes()`, `registrarCliente()`, `editarCliente()`, `eliminarCliente()`

**Proceso:**
- Validaciones de negocio: email único, formato de teléfono
- Transformación de datos según modelo de negocio
- Llamadas al ORM (Prisma) para operaciones de base de datos
- Manejo de relaciones con otras entidades (reservas, ventas)

**Salida:**
- Objetos Cliente mapeados según modelo de dominio
- Arrays de clientes para operaciones de listado

**Posibles errores:**
- Email duplicado → "El email ya está registrado"
- Referencia de integridad → "No se puede eliminar cliente con reservas activas"
- Formato de datos → "Formato de teléfono inválido"

## 4) Autenticación/JWT (emisión, verificación, expiración/refresh)

### Verificación de JWT

**Entrada:**
- Token JWT desde header Authorization
- Middleware `authMiddleware` ejecutado antes de cada endpoint

**Proceso:**
- Extracción del token removiendo prefijo "Bearer "
- Verificación de firma y expiración con `jwt.verify()`
- Decodificación del payload para obtener datos de usuario
- Validación de rol admin para operaciones sensibles

**Salida:**
- Usuario disponible en `req.user` con campos `{id, email, rol}`
- Continuación del flujo si token es válido

**Posibles errores:**
- Token malformado → 403 "Token inválido"
- Token expirado → 403 "Sesión expirada"
- Rol insuficiente → 403 "Requiere permisos de administrador"
- Secret key inválido → 500 "Error de configuración"

## 5) Base de datos (consultas, transacciones)

**Entrada:**
- Cliente Prisma conectado a PostgreSQL/Supabase
- Operaciones sobre tabla `Cliente` con campos definidos en schema

**Proceso:**
- **Listar**: `prisma.cliente.findMany({orderBy: {creadoEn: 'desc'}})`
- **Crear**: `prisma.cliente.create({data: clienteData})`
- **Actualizar**: `prisma.cliente.update({where: {id}, data: updateData})`
- **Eliminar**: `prisma.cliente.delete({where: {id}})` o soft delete
- Transacciones para operaciones complejas que afecten múltiples tablas

**Salida:**
- Objetos Cliente con todos los campos del modelo
- Conteos y agregaciones para estadísticas
- Relaciones pobladas cuando sea necesario (reservas, ventas)

**Posibles errores:**
- Constraint violation → email único duplicado
- Foreign key constraint → referencias a cliente en otras tablas
- Connection timeout → pérdida de conexión con Supabase
- Query timeout → consulta muy compleja o lenta

## 6) Respuesta al cliente y manejo de errores

### Respuesta exitosa

**Entrada:**
- Datos de cliente(s) procesados correctamente
- Operación completada sin errores

**Proceso:**
- Construcción de respuesta JSON estructurada
- Limpieza de datos sensibles antes del envío
- Headers apropiados con Content-Type y CORS

**Salida:**
```json
// GET /api/clientes
[
  {
    "id": "uuid-123",
    "nombre": "Juan Pérez",
    "email": "juan@email.com",
    "telefono": "+541234567890",
    "tipo": "Particular",
    "estado": "Activo",
    "actividad": "Empleado",
    "creadoEn": "2025-09-07T10:00:00Z"
  }
]

// POST /api/clientes
{
  "message": "Cliente creado exitosamente",
  "cliente": { /* datos del cliente creado */ }
}
```

### Manejo de errores

**Entrada:**
- Excepciones de cualquier capa del sistema
- Errores de validación, base de datos, o lógica de negocio

**Proceso:**
- Logging detallado para debugging con contexto de request
- Mapeo de errores internos a respuestas user-friendly
- Preservación de stack trace para desarrollo, ocultación en producción

**Salida:**
- Status codes HTTP semánticamente correctos
- Mensajes de error claros y accionables para el frontend

**Posibles errores:**
- 400: "Datos de cliente inválidos", "Email ya registrado"
- 401: "Token de autenticación requerido"
- 403: "Permisos insuficientes para esta operación"
- 404: "Cliente no encontrado"
- 500: "Error interno del servidor"

---

## **Alternativas y trade-offs**

### **Validación de Datos**
- **Actual**: Validación básica en controller + constraints DB
- **Alternativa**: Schema validation con Zod/Joi + class-validator
- **Trade-off**: Mayor robustez y mensajes detallados vs. mayor complejidad

### **Paginación**
- **Actual**: Carga completa de todos los clientes
- **Alternativa**: Paginación server-side con limit/offset o cursor-based
- **Trade-off**: Mejor performance con datos grandes vs. complejidad en UI

### **Filtrado y Búsqueda**
- **Actual**: Filtrado client-side en memoria
- **Alternativa**: Filtros server-side con queries SQL optimizadas
- **Trade-off**: Mejor UX inmediato vs. escalabilidad con grandes volúmenes

### **Soft Delete**
- **Actual**: Hard delete directo
- **Alternativa**: Soft delete con campo `deletedAt`
- **Trade-off**: Recuperación de datos vs. complejidad en queries

### **Audit Trail**
- **Actual**: Timestamps básicos (creadoEn, actualizadoEn)
- **Alternativa**: Sistema completo de auditoría con historial de cambios
- **Trade-off**: Trazabilidad completa vs. mayor storage y complejidad

### **Arquitectura de Datos**
- **Actual**: Modelo simple con campos básicos
- **Alternativa**: Separación en entidades Cliente/Persona con direcciones normalizadas
- **Trade-off**: Flexibilidad y normalización vs. simplicidad de queries
