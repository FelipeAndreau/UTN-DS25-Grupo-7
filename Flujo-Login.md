# Flujo: **Login con JWT**

## 1) Frontend (UI, validaciones, request)

**Entrada:** 
- Usuario ingresa email y password en el formulario de login (`Login.tsx`)
- Estados del componente: `email`, `password`, `loading`, `error`

**Proceso:**
- Validaciones client-side: campos no vacíos, formato de email válido con regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Se establece `loading = true` para mostrar estado de carga
- Se construye el objeto `LoginRequest` con las credenciales
- Se ejecuta `authService.login(credentials)` que hace fetch a `/api/auth/login`

**Salida:**
- Request HTTP POST con headers `Content-Type: application/json`
- Body: `{"email": "admin@test.com", "password": "admin123"}`

**Posibles errores:**
- Campos vacíos → mensaje "Email y password son requeridos"
- Email inválido → mensaje "Formato de email inválido" 
- Error de red → no se puede conectar al servidor

## 2) Middleware/HTTP (headers, cookies)

**Entrada:**
- Request HTTP POST a `http://localhost:3000/api/auth/login`
- Headers: `Content-Type: application/json`, `Accept: application/json`
- Body JSON con credenciales

**Proceso:**
- CORS middleware valida origen permitido
- `express.json()` parsea el body JSON automáticamente
- Request llega al router `/api/auth` sin middleware de autenticación (ruta pública)

**Salida:**
- Request parseado disponible en `req.body` para el controller
- Headers de CORS añadidos a la respuesta

**Posibles errores:**
- CORS blocked → origen no permitido
- JSON malformado → error 400 "Invalid JSON"
- Payload muy grande → error 413 "Payload too large"

## 3) Backend: Controller → Service → ORM

### Controller (`auth.controller.ts`)

**Entrada:**
- `req.body` con `{email, password}`
- Función `login(req: Request, res: Response)`

**Proceso:**
- Validación de entrada: campos requeridos y formato email
- Llamada a `loginUser(email, password)` del service layer
- Construcción de respuesta exitosa con token y user data

**Salida:**
- Respuesta JSON con estructura: `{success: true, message: "Login exitoso", token, user}`

**Posibles errores:**
- Campos faltantes → 400 "Email y password son requeridos"
- Email inválido → 400 "Formato de email inválido"
- Error del service → 500 "Error interno del servidor"

### Service (`auth.service.ts`)

**Entrada:**
- Parámetros `email: string, password: string`
- Función `loginUser(email, password): Promise<LoginResponse>`

**Proceso:**
- Verificación de credenciales hardcodeadas para usuarios de prueba (admin@test.com, viewer@test.com)
- Para usuarios reales: consulta a Prisma `prisma.usuario.findUnique({where: {email}})`
- Validación de contraseña con `bcrypt.compare(password, user.password)`
- Generación de JWT token con `generateToken({id, email, rol})`

**Salida:**
- Objeto `LoginResponse` con token JWT y datos del usuario

**Posibles errores:**
- Usuario no encontrado → 401 "Credenciales inválidas"
- Usuario inactivo → 401 "Usuario desactivado"
- Contraseña incorrecta → 401 "Credenciales inválidas"

## 4) Autenticación/JWT (emisión, verificación, expiración/refresh)

### Emisión de JWT

**Entrada:**
- Payload con datos del usuario: `{id, email, rol}`
- Secret key desde `process.env.JWT_SECRET` o fallback "tu-secret-key"

**Proceso:**
- `jwt.sign(payload, secret, {expiresIn: "7d"})` usando biblioteca jsonwebtoken
- Token incluye claims estándar: `iat` (issued at), `exp` (expiration)
- Algoritmo de firma: HS256 (HMAC SHA-256)

**Salida:**
- JWT token string codificado en base64
- Estructura: `header.payload.signature`

**Posibles errores:**
- Secret key faltante → token inseguro con fallback
- Payload inválido → error de generación de token

### Verificación (para futuras requests)

**Entrada:**
- JWT token desde header `Authorization: Bearer <token>`
- Middleware `authMiddleware` en rutas protegidas

**Proceso:**
- Extracción del token removiendo "Bearer " prefix
- Verificación con `jwt.verify(token, secret)`
- Decodificación del payload y validación de expiración

**Salida:**
- Usuario decodificado disponible en `req.user`
- Continuación del flujo de la request

**Posibles errores:**
- Token ausente → 401 "Token no proporcionado"
- Token inválido → 403 "Token inválido"
- Token expirado → 403 "Token expirado"

## 5) Base de datos (consultas, transacciones)

**Entrada:**
- Email del usuario para búsqueda
- Cliente Prisma configurado con PostgreSQL/Supabase

**Proceso:**
- Query: `prisma.usuario.findUnique({where: {email: email}})`
- Consulta única sin transacciones (operación atómica simple)
- Índice único en columna email para performance

**Salida:**
- Objeto Usuario completo o `null` si no existe
- Campos: `{id, nombre, email, password, rol, activo, creadoEn}`

**Posibles errores:**
- Base de datos no disponible → timeout de conexión
- Índice corrupto → error de consulta
- Conexión perdida → error de red con Supabase

## 6) Respuesta al cliente y manejo de errores

### Respuesta exitosa

**Entrada:**
- Token JWT generado y datos del usuario validado
- Status code 200 por defecto

**Proceso:**
- Construcción de respuesta JSON estructurada
- Headers automáticos: `Content-Type: application/json`
- No se almacena información sensible (password)

**Salida:**
```json
{
  "success": true,
  "message": "Login exitoso", 
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-123",
    "rol": "admin", 
    "nombre": "Admin Usuario"
  }
}
```

### Manejo de errores

**Entrada:**
- Excepciones capturadas en bloques try-catch
- Diferentes tipos de errores según la etapa fallida

**Proceso:**
- Error logging con `console.error()` para debugging
- Mapeo de errores internos a respuestas user-friendly
- Status codes apropiados: 400 (validación), 401 (auth), 500 (servidor)

**Salida:**
- Respuestas de error estructuradas sin exponer detalles internos
- Headers de CORS mantenidos para requests cross-origin

**Posibles errores:**
- 400: "Email y password son requeridos", "Formato de email inválido"
- 401: "Credenciales inválidas", "Usuario desactivado"  
- 500: "Error interno del servidor"

---

## **Alternativas y trade-offs**

### **Autenticación**
- **Alternativa**: OAuth2/OpenID Connect con proveedores externos (Google, Microsoft)
- **Trade-off**: Mayor seguridad y UX vs. mayor complejidad de implementación

### **JWT Storage**
- **Actual**: LocalStorage en frontend
- **Alternativa**: Secure HTTP-only cookies
- **Trade-off**: Protección XSS vs. mayor complejidad CSRF

### **Token Expiration**
- **Actual**: 7 días fijo sin refresh
- **Alternativa**: Refresh tokens con rotación
- **Trade-off**: Mejor seguridad vs. mayor complejidad de manejo

### **Password Security**
- **Actual**: bcrypt con salt rounds por defecto
- **Alternativa**: Argon2 o scrypt con parámetros ajustables
- **Trade-off**: Mayor resistencia a ataques vs. mayor consumo CPU

### **Database Strategy**
- **Actual**: Consulta directa sin cache
- **Alternativa**: Redis cache para usuarios frecuentes
- **Trade-off**: Mejor performance vs. consistencia eventual y complejidad

### **Error Handling**
- **Actual**: Try-catch básico con logging a consola
- **Alternativa**: Middleware centralizado de errores con sistema de logging estructurado
- **Trade-off**: Mejor observabilidad vs. mayor overhead inicial
