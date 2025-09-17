# Flujo: **Gestión de Reservas**

## 1) Frontend (UI, validaciones, request)

**Entrada:** 
- Admin accede desde Dashboard a "Gestión de Reservas" o Cliente desde "Mis Reservas"
- Componentes: `GestionClientes.tsx` (ver reservas de cliente), `Catalogo.tsx` (mis reservas)
- Estados: `reservas[]`, `reservaSeleccionada`, `loading`, `error`, `clienteId` (opcional)

**Proceso:**
- **Crear Reserva**: Usuario selecciona vehículo, completa formulario (fecha visita, datos contacto)
- **Listar Reservas**: Admin ve todas, Cliente ve solo las suyas, filtros por cliente específico
- **Cancelar Reserva**: Cambio de estado de "Activa" a "Cancelada"
- Validaciones: fecha futura, vehículo disponible, datos contacto completos

**Salida:**
- GET `/api/reservas/cliente/{clienteId}` - reservas de un cliente específico
- GET `/api/reservas/mis-reservas` - reservas del usuario autenticado
- POST `/api/public/reservas` - crear reserva pública (sin auth)
- POST `/api/reservas/crear` - crear reserva autenticada
- PATCH `/api/reservas/{id}/cancelar` - cancelar reserva

**Posibles errores:**
- Fecha inválida → "Seleccione una fecha futura"
- Vehículo no disponible → "El vehículo ya no está disponible"
- Datos incompletos → "Complete todos los campos requeridos"
- Usuario no autenticado → redirección a login

## 2) Middleware/HTTP (headers, cookies)

**Entrada:**
- Rutas públicas (`/api/public/reservas`) sin autenticación
- Rutas protegidas con JWT token en Authorization header
- Content-Type: application/json para crear/actualizar reservas

**Proceso:**
- CORS permite requests desde frontend (localhost:5173)
- Parsing JSON automático con express.json()
- `authMiddleware` solo en rutas protegidas (/api/reservas/*)
- Middleware específico para verificar ownership (cliente solo ve sus reservas)

**Salida:**
- Request con `req.user` en rutas autenticadas
- Body parseado disponible en `req.body`
- Headers CORS establecidos correctamente

**Posibles errores:**
- Ruta pública sin token → continúa normal
- Ruta protegida sin token → 401 "Token requerido"
- Token inválido → 403 "Token inválido"
- CORS policy → bloqueo de request cross-origin

## 3) Backend: Controller → Service → Repo/ORM

### Controller (`reservas.controller.ts`)

**Entrada:**
- Requests para CRUD de reservas
- Parámetros: `clienteId` (ruta), `reservaId`, datos de reserva en body

**Proceso:**
- `crearReserva()`: validar datos y crear nueva reserva
- `listarReservasCliente()`: obtener reservas por clienteId específico
- `obtenerMisReservas()`: reservas del usuario autenticado (desde JWT)
- `cancelarReserva()`: cambiar estado a "Cancelada" + logging

**Salida:**
- JSON con reserva(s) incluyendo datos de vehículo y cliente relacionados
- Status codes: 200 (éxito), 201 (creada), 400 (error validación)

**Posibles errores:**
- ClienteId inválido → 400 "ID de cliente inválido"
- Reserva no encontrada → 404 "Reserva no encontrada"
- Reserva ya cancelada → 400 "La reserva ya está cancelada"

### Service (`reservas.service.ts`)

**Entrada:**
- DTOs: `CrearReservaDTO`, parámetros de filtrado
- Funciones: `crearReserva()`, `listarReservasCliente()`, `cancelarReserva()`

**Proceso:**
- **Crear**: validar disponibilidad vehículo, generar ID cliente si no existe
- **Listar**: queries con joins a tablas Vehiculo y Cliente
- **Cancelar**: update de estado + creación de log de auditoría
- Transformación de datos entre modelo DB y respuesta API

**Salida:**
- Objetos `ReservaResponse` con datos completos de reserva
- Arrays de reservas con información relacionada poblada

**Posibles errores:**
- Vehículo no disponible → "El vehículo seleccionado no está disponible"
- Cliente inexistente → auto-creación o error según contexto
- Conflicto de estado → "No se puede cancelar una reserva ya procesada"

## 4) Autenticación/JWT (emisión, verificación, expiración/refresh)

### Verificación contextual

**Entrada:**
- Rutas públicas: no requieren token (crear reserva anónima)
- Rutas privadas: token JWT obligatorio
- Middleware condicional según endpoint

**Proceso:**
- **Rutas públicas**: `/api/public/reservas` - sin autenticación
- **Rutas privadas**: `/api/reservas/*` - JWT requerido
- Verificación de ownership: usuario solo accede a sus propias reservas
- Admin puede acceder a todas las reservas

**Salida:**
- `req.user` disponible en rutas autenticadas
- Autorización granular según rol y ownership

**Posibles errores:**
- Acceso no autorizado → "Solo puede ver sus propias reservas"
- Rol insuficiente → "Permisos de administrador requeridos"
- Token expirado durante operación → "Sesión expirada, inicie sesión nuevamente"

## 5) Base de datos (consultas, transacciones)

**Entrada:**
- Operaciones sobre tabla `Reserva` con relaciones a `Cliente` y `Vehiculo`
- Prisma Client con conexiones a PostgreSQL/Supabase

**Proceso:**
- **Crear Reserva**:
  ```sql
  INSERT INTO Reserva (clienteId, vehiculoId, fecha, fechaVisita, estado)
  VALUES (?, ?, NOW(), ?, 'Activa')
  ```
- **Listar con joins**:
  ```sql
  SELECT r.*, c.nombre, c.email, v.marca, v.modelo, v.precio
  FROM Reserva r 
  JOIN Cliente c ON r.clienteId = c.id
  JOIN Vehiculo v ON r.vehiculoId = v.id
  WHERE r.clienteId = ?
  ```
- **Transacciones** para operaciones complejas (crear reserva + actualizar estado vehículo)

**Salida:**
- Objetos Reserva con relaciones pobladas (cliente, vehículo)
- Datos agregados y estadísticas de reservas

**Posibles errores:**
- Foreign key violation → cliente o vehículo no existe
- Unique constraint → reserva duplicada para mismo cliente/vehículo
- Connection timeout → problemas de red con Supabase
- Deadlock → transacciones concurrentes en mismos recursos

## 6) Respuesta al cliente y manejo de errores

### Respuesta exitosa

**Entrada:**
- Reservas procesadas correctamente con datos relacionados
- Operaciones CRUD completadas exitosamente

**Proceso:**
- Serialización de objetos complejos (fechas, relaciones)
- Limpieza de datos sensibles (passwords, tokens internos)
- Formateo consistente de fechas ISO 8601

**Salida:**
```json
// GET /api/reservas/cliente/123
{
  "reservas": [
    {
      "id": 1,
      "clienteId": "123",
      "vehiculoId": 5,
      "fecha": "2025-09-07T10:30:00Z",
      "fechaVisita": "2025-09-10T14:00:00Z",
      "estado": "Activa",
      "cliente": {
        "nombre": "Juan Pérez",
        "email": "juan@email.com",
        "telefono": "+541234567890"
      },
      "vehiculo": {
        "marca": "Toyota",
        "modelo": "Corolla",
        "anio": 2023,
        "precio": 25000
      }
    }
  ]
}

// POST /api/reservas/crear
{
  "success": true,
  "message": "Reserva creada exitosamente",
  "reserva": { /* datos de la reserva */ }
}
```

### Manejo de errores

**Entrada:**
- Errores de validación, base de datos, o lógica de negocio
- Excepciones de servicios externos o timeouts

**Proceso:**
- Logging estructurado con contexto de reserva (IDs, timestamps)
- Mapeo de errores técnicos a mensajes business-friendly
- Preservación de información de debugging en logs

**Salida:**
- Respuestas de error contextuales y accionables

**Posibles errores:**
- 400: "Fecha de visita debe ser futura", "Vehículo no disponible"
- 401: "Debe iniciar sesión para crear reservas"
- 403: "No puede acceder a reservas de otros clientes"
- 404: "Reserva no encontrada"
- 409: "Ya existe una reserva activa para este vehículo"
- 500: "Error interno procesando la reserva"

---

## **Alternativas y trade-offs**

### **Modelo de Reservas**
- **Actual**: Reservas simples con fecha de visita
- **Alternativa**: Sistema de slots de tiempo con disponibilidad horaria
- **Trade-off**: Mayor precisión vs. complejidad de gestión de calendario

### **Estados de Reserva**
- **Actual**: Estados básicos (Activa, Cancelada, Vencida)
- **Alternativa**: Workflow completo (Pendiente → Confirmada → En Proceso → Completada)
- **Trade-off**: Mayor control del proceso vs. complejidad de transiciones

### **Notificaciones**
- **Actual**: Sin notificaciones automáticas
- **Alternativa**: Email/SMS automático en creación/cancelación
- **Trade-off**: Mejor UX vs. dependencia de servicios externos

### **Expiración Automática**
- **Actual**: Estados manuales
- **Alternativa**: Job scheduler que expire reservas automáticamente
- **Trade-off**: Consistencia automática vs. complejidad de infraestructura

### **Conflictos de Reserva**
- **Actual**: Validación simple al momento de crear
- **Alternativa**: Sistema de locks optimistas con retry logic
- **Trade-off**: Mejor manejo de concurrencia vs. mayor complejidad

### **Datos de Cliente**
- **Actual**: Clientes anónimos para reservas públicas
- **Alternativa**: Requerir registro obligatorio para todas las reservas
- **Trade-off**: Menor fricción vs. mejor trazabilidad y follow-up
