# Flujo: **Gestión de Vehículos**

## 1) Frontend (UI, validaciones, request)

**Entrada:** 
- Admin accede a "Gestión de Vehículos" desde Dashboard (`GestionVehiculos.tsx`)
- Formulario con campos: `marca`, `modelo`, `anio`, `precio`, `estado`, `imagen`, `descripcion`
- Estados: `vehiculos[]`, `nuevoVehiculo`, `vehiculoSeleccionado`, `modalTipo`, `loading`, `error`

**Proceso:**
- **Carga inicial**: `useEffect` ejecuta `cargarVehiculos()` obteniendo lista completa
- **Validaciones client-side**: campos requeridos, año válido (1990-2025), precio > 0
- **Gestión de imágenes**: preview local, validación de formato/tamaño
- **Estados del vehículo**: Disponible, Reservado, Vendido, Mantenimiento
- **Operaciones CRUD**: crear, listar, actualizar, eliminar vehículos
- **Filtros dinámicos**: búsqueda por marca, modelo, año, rango de precios

**Salida:**
- GET `/api/vehiculos` - listar todos los vehículos
- POST `/api/vehiculos` - crear nuevo vehículo
- PUT `/api/vehiculos/{id}` - actualizar vehículo existente
- DELETE `/api/vehiculos/{id}` - eliminar vehículo

**Posibles errores:**
- Campos requeridos vacíos → "Marca, modelo y precio son obligatorios"
- Año inválido → "El año debe estar entre 1990 y 2025"
- Precio inválido → "El precio debe ser mayor a 0"
- Imagen muy grande → "La imagen no debe superar 5MB"

## 2) Middleware/HTTP (headers, cookies)

**Entrada:**
- Todas las rutas de vehículos requieren autenticación JWT
- Headers: `Authorization: Bearer {token}`, `Content-Type: application/json`
- Multipart/form-data para uploads de imágenes

**Proceso:**
- CORS middleware permite requests desde frontend
- `authMiddleware` valida JWT en todas las rutas `/api/vehiculos`
- Middleware de rol admin para operaciones de escritura
- `express.json()` parsea datos del vehículo
- Multer middleware para manejo de archivos de imagen (opcional)

**Salida:**
- Request autenticado con `req.user` disponible
- Body y archivos parseados correctamente
- Validación de permisos completada

**Posibles errores:**
- Token ausente → 401 "Autenticación requerida"
- Rol insuficiente → 403 "Se requieren permisos de administrador"
- Archivo muy grande → 413 "Archivo excede el límite permitido"
- Tipo de archivo inválido → 400 "Solo se permiten imágenes JPG, PNG"

## 3) Backend: Controller → Service → Repo/ORM

### Controller (`vehiculos.controller.ts`)

**Entrada:**
- Request autenticado con datos del vehículo
- Parámetros de query para filtros: `estado`, `marca`, `anio`, `minPrecio`, `maxPrecio`

**Proceso:**
- `getVehiculos()`: listar con filtros opcionales, ordenamiento por fecha
- `postVehiculo()`: validar datos requeridos y crear nuevo vehículo
- `putVehiculo()`: actualizar vehículo existente con validaciones
- `deleteVehiculo()`: verificar que no tenga reservas activas antes de eliminar

**Salida:**
- Arrays de vehículos con paginación opcional
- Objetos de vehículo individual con todos los campos
- Status codes apropiados y mensajes descriptivos

**Posibles errores:**
- Vehículo no encontrado → 404 "Vehículo no existe"
- Datos inválidos → 400 "Datos del vehículo inválidos"
- No se puede eliminar → 409 "No se puede eliminar vehículo con reservas activas"

### Service (`vehiculos.service.ts`)

**Entrada:**
- DTOs: `CreateVehiculoRequest`, `UpdateVehiculoRequest`
- Funciones: `listarVehiculos()`, `registrarVehiculo()`, `editarVehiculo()`, `eliminarVehiculo()`

**Proceso:**
- **Validaciones de negocio**: precio razonable, año consistente con marca/modelo
- **Gestión de imágenes**: procesamiento, redimensionado, almacenamiento
- **Estados automáticos**: cambiar a "Vendido" cuando se registra venta
- **Integridad referencial**: verificar dependencias antes de eliminar

**Salida:**
- Objetos `VehiculoResponse` mapeados para API
- Agregaciones y estadísticas de inventario

**Posibles errores:**
- Imagen corrupta → "Error procesando la imagen"
- Datos inconsistentes → "Año no coincide con el modelo del vehículo"
- Storage lleno → "Error almacenando imagen del vehículo"

## 4) Autenticación/JWT (emisión, verificación, expiración/refresh)

### Verificación y Autorización

**Entrada:**
- JWT token en Authorization header
- Todas las operaciones requieren rol admin

**Proceso:**
- `authMiddleware` extrae y verifica token JWT
- Decodificación del payload para obtener rol de usuario
- Validación específica: solo usuarios con rol "admin" pueden gestionar vehículos
- Log de acceso para auditoría de cambios en inventario

**Salida:**
- Usuario admin autenticado en `req.user`
- Autorización completada para operaciones CRUD

**Posibles errores:**
- Usuario viewer → 403 "Solo administradores pueden gestionar vehículos"
- Token expirado → 403 "Sesión expirada, inicie sesión nuevamente"
- Token manipulado → 403 "Token de autenticación inválido"

## 5) Base de datos (consultas, transacciones)

**Entrada:**
- Tabla `Vehiculo` con campos: id, marca, modelo, anio, precio, estado, imagen, descripcion
- Prisma Client para operaciones ORM sobre PostgreSQL

**Proceso:**
- **Listar con filtros**:
  ```sql
  SELECT * FROM Vehiculo 
  WHERE estado = ? AND marca ILIKE ? AND precio BETWEEN ? AND ?
  ORDER BY creadoEn DESC
  ```
- **Crear vehículo**:
  ```sql
  INSERT INTO Vehiculo (marca, modelo, anio, precio, estado, descripcion)
  VALUES (?, ?, ?, ?, 'Disponible', ?)
  ```
- **Verificar dependencias antes de eliminar**:
  ```sql
  SELECT COUNT(*) FROM Reserva WHERE vehiculoId = ? AND estado = 'Activa'
  ```
- **Transacciones** para operaciones complejas (crear + upload imagen)

**Salida:**
- Objetos Vehiculo completos con metadatos
- Conteos y estadísticas de inventario por estado
- Validaciones de integridad referencial

**Posibles errores:**
- Unique constraint → marca/modelo/año duplicado (si aplica)
- Foreign key violation → referencias desde reservas o ventas
- Storage constraint → límite de espacio para imágenes
- Index corruption → errores de consulta por marca/modelo

## 6) Respuesta al cliente y manejo de errores

### Respuesta exitosa

**Entrada:**
- Vehículos procesados correctamente con imágenes y metadatos
- Operaciones CRUD completadas

**Proceso:**
- Serialización de datos numéricos (precio) con formato correcto
- URLs completas para imágenes (con dominio base)
- Filtrado de campos internos (timestamps de auditoría)

**Salida:**
```json
// GET /api/vehiculos
[
  {
    "id": 1,
    "marca": "Toyota",
    "modelo": "Corolla",
    "anio": 2023,
    "precio": 25000,
    "estado": "Disponible",
    "imagen": "/images/vehiculos/toyota-corolla-2023.jpg",
    "descripcion": "Sedán compacto, excelente rendimiento de combustible",
    "creadoEn": "2025-09-07T10:00:00Z"
  }
]

// POST /api/vehiculos
{
  "message": "Vehículo registrado exitosamente",
  "vehiculo": {
    "id": 15,
    "marca": "Honda",
    "modelo": "Civic",
    // ... otros campos
  }
}
```

### Manejo de errores

**Entrada:**
- Errores de validación, base de datos, storage de imágenes
- Excepciones de servicios externos (CDN, procesamiento de imágenes)

**Proceso:**
- Logging detallado con contexto del vehículo (marca, modelo, operación)
- Rollback de transacciones en caso de fallos parciales
- Limpieza de recursos (archivos temporales, conexiones DB)

**Salida:**
- Mensajes de error específicos y accionables

**Posibles errores:**
- 400: "Precio debe ser un número positivo", "Año fuera del rango permitido"
- 401: "Debe iniciar sesión para gestionar vehículos"
- 403: "Solo administradores pueden realizar esta acción"
- 404: "Vehículo no encontrado"
- 409: "No se puede eliminar vehículo con reservas pendientes"
- 413: "Imagen demasiado grande, máximo 5MB"
- 500: "Error procesando imagen del vehículo"

---

## **Alternativas y trade-offs**

### **Gestión de Imágenes**
- **Actual**: Almacenamiento local en servidor
- **Alternativa**: CDN externo (Cloudinary, AWS S3)
- **Trade-off**: Costo operativo vs. mejor performance y escalabilidad

### **Validación de Datos**
- **Actual**: Validaciones básicas en controller
- **Alternativa**: Schema validation con Zod + validaciones de dominio
- **Trade-off**: Mayor robustez vs. complejidad de implementación

### **Estados de Vehículo**
- **Actual**: Estados simples (Disponible, Reservado, Vendido)
- **Alternativa**: Workflow completo con estados intermedios y transiciones
- **Trade-off**: Mayor control del proceso vs. complejidad de lógica de negocio

### **Búsqueda y Filtros**
- **Actual**: Filtros simples con LIKE en base de datos
- **Alternativa**: Search engine (Elasticsearch) con indexación completa
- **Trade-off**: Búsquedas más potentes vs. infraestructura adicional

### **Versionado de Imágenes**
- **Actual**: Una imagen por vehículo
- **Alternativa**: Múltiples imágenes con diferentes tamaños (thumbnails, gallery)
- **Trade-off**: Mejor UX vs. mayor complejidad de storage

### **Auditoría de Cambios**
- **Actual**: Timestamps básicos de creación/actualización
- **Alternativa**: Log completo de cambios con historial detallado
- **Trade-off**: Trazabilidad completa vs. mayor overhead de storage

### **Integración con Reservas**
- **Actual**: Verificación simple de reservas activas
- **Alternativa**: Sistema de locks para prevenir double-booking
- **Trade-off**: Consistencia garantizada vs. mayor complejidad de concurrencia
