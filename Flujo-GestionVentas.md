# Flujo: **Gestión de Ventas**

## 1) Frontend (UI, validaciones, request)

**Entrada:** 
- Admin accede a "Gestión de Ventas" desde Dashboard (`VentasAdmin.tsx`)
- Formulario con campos: `clienteId`, `vehiculoId`, `fecha`, `monto`
- Estados: `ventas[]`, `clientes[]`, `vehiculos[]`, `editingVenta`, `form`, `showCalendar`, `selectedDate`

**Proceso:**
- **Carga inicial**: `useEffect` obtiene ventas, clientes y vehículos disponibles
- **Validaciones client-side**: cliente seleccionado, vehículo disponible, monto > 0, fecha válida
- **Selector de fecha**: Integración con `CalendarModal` para selección visual de fechas
- **Dropdowns dinámicos**: Clientes existentes y vehículos disponibles (no vendidos)
- **Operaciones CRUD**: crear, listar, actualizar, eliminar ventas
- **Búsqueda y filtros**: por cliente, vehículo, rango de fechas, monto

**Salida:**
- GET `/api/ventas` - listar todas las ventas
- POST `/api/ventas` - crear nueva venta
- PUT `/api/ventas/{id}` - actualizar venta existente
- DELETE `/api/ventas/{id}` - eliminar venta

**Posibles errores:**
- Campos requeridos vacíos → "Cliente, vehículo y monto son obligatorios"
- Monto inválido → "El monto debe ser un número positivo"
- Vehículo ya vendido → "El vehículo seleccionado ya fue vendido"
- Fecha futura → "No se pueden registrar ventas futuras"

## 2) Middleware/HTTP (headers, cookies)

**Entrada:**
- Todas las rutas de ventas requieren autenticación JWT con rol admin
- Headers: `Authorization: Bearer {token}`, `Content-Type: application/json`
- Body con datos de venta en formato JSON

**Proceso:**
- CORS middleware permite requests desde frontend
- `authMiddleware` valida JWT y extrae datos del usuario
- `adminMiddleware` o verificación de rol para operaciones de ventas
- `express.json()` parsea automáticamente el body JSON
- Rate limiting para prevenir spam de operaciones costosas

**Salida:**
- Request autenticado con `req.user` que incluye rol admin
- Body parseado disponible en `req.body`
- Headers CORS configurados correctamente

**Posibles errores:**
- Token ausente/inválido → 401 "Autenticación requerida"
- Rol insuficiente → 403 "Solo administradores pueden gestionar ventas"
- JSON malformado → 400 "Formato de datos inválido"
- Rate limit excedido → 429 "Demasiadas requests, intente más tarde"

## 3) Backend: Controller → Service → Repo/ORM

### Controller (`ventas.controller.ts`)

**Entrada:**
- Request autenticado con datos de venta
- Parámetros de query para filtros: cliente, vehículo, fechas

**Proceso:**
- `getVentas()`: listar todas las ventas con datos relacionados (cliente, vehículo)
- `postVenta()`: validar datos, verificar disponibilidad de vehículo, crear venta
- `putVenta()`: actualizar venta existente con validaciones de integridad
- `deleteVenta()`: eliminar venta y restaurar estado del vehículo

**Salida:**
- JSON con ventas incluyendo datos completos de cliente y vehículo
- Respuestas estructuradas con status codes semánticos
- Mensajes descriptivos para cada operación

**Posibles errores:**
- Venta no encontrada → 404 "Venta no existe"
- Vehículo no disponible → 409 "El vehículo ya está vendido"
- Datos inválidos → 400 "Datos de venta inválidos"

### Service (`ventas.service.ts`)

**Entrada:**
- DTOs: `CreateVentaRequest`, `UpdateVentaRequest`
- Funciones: `listarVentas()`, `registrarVenta()`, `editarVenta()`, `eliminarVenta()`

**Proceso:**
- **Validaciones de negocio**: vehículo disponible, cliente válido, monto razonable
- **Transacciones atómicas**: crear venta + actualizar estado vehículo a "Vendido"
- **Cálculos automáticos**: comisiones, impuestos, totales
- **Integridad referencial**: verificar que cliente y vehículo existan

**Salida:**
- Objetos `VentaResponse` con datos completos
- Estadísticas y agregaciones de ventas
- Validaciones de consistencia de datos

**Posibles errores:**
- Vehículo reservado → "No se puede vender vehículo con reservas activas"
- Monto inconsistente → "El monto no coincide con el precio del vehículo"
- Cliente inactivo → "No se puede vender a cliente desactivado"

## 4) Autenticación/JWT (emisión, verificación, expiración/refresh)

### Verificación y Autorización Granular

**Entrada:**
- JWT token con rol específico
- Operaciones de alta sensibilidad (dinero, contratos)

**Proceso:**
- `authMiddleware` verifica token y extrae usuario
- Validación de rol admin obligatoria para todas las operaciones de ventas
- Log de auditoría para todas las operaciones financieras
- Verificación de permisos específicos (crear vs. eliminar ventas)

**Salida:**
- Usuario admin autenticado con permisos completos
- Trazabilidad de quien realizó cada operación de venta

**Posibles errores:**
- Usuario viewer → 403 "Solo administradores pueden gestionar ventas"
- Token expirado durante transacción → 403 "Sesión expirada durante la operación"
- Permisos insuficientes → 403 "No tiene permisos para eliminar ventas"

## 5) Base de datos (consultas, transacciones)

**Entrada:**
- Tabla `Venta` relacionada con `Cliente` y `Vehiculo`
- Operaciones transaccionales críticas que afectan múltiples entidades

**Proceso:**
- **Crear venta con transacción**:
  ```sql
  BEGIN TRANSACTION;
  INSERT INTO Venta (clienteId, vehiculoId, fecha, monto) VALUES (?, ?, ?, ?);
  UPDATE Vehiculo SET estado = 'Vendido' WHERE id = ?;
  INSERT INTO LogEvento (...) VALUES (...); -- Auditoría
  COMMIT;
  ```
- **Listar ventas con joins**:
  ```sql
  SELECT v.*, c.nombre as clienteNombre, vh.marca, vh.modelo 
  FROM Venta v 
  JOIN Cliente c ON v.clienteId = c.id 
  JOIN Vehiculo vh ON v.vehiculoId = vh.id
  ORDER BY v.fecha DESC
  ```
- **Validaciones de integridad antes de eliminar**:
  ```sql
  SELECT COUNT(*) FROM DocumentosVenta WHERE ventaId = ?
  ```

**Salida:**
- Ventas con datos completos de entidades relacionadas
- Consistencia garantizada mediante transacciones ACID
- Logs de auditoría para compliance

**Posibles errores:**
- Deadlock → transacciones concurrentes sobre mismo vehículo
- Constraint violation → referencia a cliente/vehículo inexistente
- Transaction timeout → operación muy larga, rollback automático
- Concurrent update → otro usuario modificó el vehículo simultáneamente

## 6) Respuesta al cliente y manejo de errores

### Respuesta exitosa

**Entrada:**
- Venta procesada correctamente con todas las validaciones
- Transacción completada exitosamente

**Proceso:**
- Formateo de montos con precisión decimal correcta
- Fechas en formato ISO 8601 para consistencia
- Inclusión de datos relacionados (cliente, vehículo) para UI
- Cálculo de totales y estadísticas en tiempo real

**Salida:**
```json
// GET /api/ventas
[
  {
    "id": 1,
    "clienteId": "uuid-123",
    "vehiculoId": 5,
    "fecha": "2025-09-07T14:30:00Z",
    "monto": 25000.00,
    "cliente": {
      "id": "uuid-123",
      "nombre": "María González",
      "email": "maria@email.com"
    },
    "vehiculo": {
      "id": 5,
      "marca": "Toyota",
      "modelo": "Corolla",
      "anio": 2023,
      "estado": "Vendido"
    },
    "creadoEn": "2025-09-07T14:30:00Z"
  }
]

// POST /api/ventas
{
  "success": true,
  "message": "Venta registrada exitosamente",
  "venta": {
    "id": 25,
    "monto": 32000.00,
    // ... datos completos de la venta
  },
  "vehiculoActualizado": {
    "id": 8,
    "estado": "Vendido"
  }
}
```

### Manejo de errores

**Entrada:**
- Errores de transacciones, validaciones de negocio, consistencia de datos
- Fallos en operaciones críticas que afectan dinero

**Proceso:**
- Rollback automático de transacciones fallidas
- Logging detallado con contexto financiero (montos, IDs, timestamps)
- Notificación de errores críticos a administradores
- Preservación de integridad de datos ante cualquier fallo

**Salida:**
- Mensajes de error específicos sin exponer detalles técnicos
- Códigos de error estructurados para manejo en frontend

**Posibles errores:**
- 400: "Monto inválido", "Cliente o vehículo no válido", "Fecha de venta inválida"
- 401: "Debe iniciar sesión para gestionar ventas"
- 403: "Solo administradores pueden realizar operaciones de venta"
- 404: "Venta no encontrada"
- 409: "El vehículo ya fue vendido", "Conflicto con reserva activa"
- 422: "El monto no coincide con el precio del vehículo"
- 500: "Error procesando la venta", "Error en transacción financiera"

---

## **Alternativas y trade-offs**

### **Modelo de Precios**
- **Actual**: Precio fijo por vehículo
- **Alternativa**: Sistema de precios dinámicos con descuentos y promociones
- **Trade-off**: Mayor flexibilidad comercial vs. complejidad de cálculos

### **Proceso de Venta**
- **Actual**: Venta directa en un paso
- **Alternativa**: Workflow multi-paso (cotización → propuesta → contrato → pago)
- **Trade-off**: Mayor control del proceso vs. mayor complejidad de estados

### **Manejo de Pagos**
- **Actual**: Solo registro del monto final
- **Alternativa**: Integración con procesadores de pago (Stripe, PayPal)
- **Trade-off**: Automatización completa vs. dependencias externas

### **Facturación**
- **Actual**: Sin generación automática de documentos
- **Alternativa**: Generación automática de facturas y recibos PDF
- **Trade-off**: Compliance automático vs. complejidad de templates

### **Comisiones y Reporting**
- **Actual**: Datos básicos de venta
- **Alternativa**: Sistema completo de comisiones, KPIs y analytics
- **Trade-off**: Insights de negocio vs. complejidad de cálculos

### **Integración Contable**
- **Actual**: Datos aislados en la aplicación
- **Alternativa**: Integración con software contable (QuickBooks, SAP)
- **Trade-off**: Flujo contable automatizado vs. dependencias de terceros

### **Validación de Montos**
- **Actual**: Validación básica de rango
- **Alternativa**: Validación inteligente basada en precios de mercado
- **Trade-off**: Prevención de errores vs. complejidad de reglas de negocio
