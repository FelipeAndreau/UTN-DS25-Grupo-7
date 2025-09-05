# Backend - AutoSales⚙️💻

## Estructura de carpetas🗂️
Resumen de la estructura del proyecto, destacando y definiendo las capas que consideramos que tienen mayor importancia.

# 🗄️Prisma ORM/
Contiene el esquema de la base de la base de datos:
schema.prisma → archivo de configuración donde se definen datos, tablas  y relaciones.

# 📂SRC/ 

## 🎛️Controllers/
Los controladores se encargan de recibir las solicitudes HTTP, de interpretarlas y de derivar la ejecución de la lógica al servicio adecuado.

- `auth.controller.ts`
- `clientes.controller.ts`
- `config.controller.ts`
- `dashboard.controller.ts`
- `logs.controller.ts`
- `reportes.controller.ts`
- `reservas.controller.ts`
- `usuarios.controller.ts`
- `vehiculos.controller.ts`
- `ventas.controller.ts`

## 🔐Middlewares/
Funciones que se ejecutan pre-controller (validar datos, autenticar usuario, ect) y post-controller (manejar errores, etc).

- `auth.middleware.ts`
- `errorHandlerMiddleware.ts`
- `requireRoleMiddleware.ts`
- `validation.middleware.ts`
	
## 🛣️Routes/
Definición de endpoints que recibe la API y que direccionan la petición hacia los Controllers.

- `auth.routes.ts`
- `clientes.routes.ts`
- `config.route.ts`
- `dashboard.routes.ts`
- `logs.routes.ts`
- `reportes.routes.ts`
- `reservas.routes.ts`
- `usuarios.routes.ts`
- `vehiculos.routes.ts`
- `ventas.routes.ts`


## 🛠️Services/
Implementan las reglas del negocio y se encargan de interactuar con la base de datos.

- `auth.service.ts`
- `clientes.service.ts`
- `config.service.ts`
- `dashboard.service.ts`
- `logs.service.ts`
- `reportes.service.ts`
- `reservas.service.ts`
- `usuarios.service.ts`
- `vehiculos.service.ts`
- `ventas.service.ts`

## ✅Validations/
Las validaciones aseguran que los datos que ingresan al sistema sean correctos y confiables antes de ejecutar la lógica de negocio o interactuar con la base de datos. 

- `cliente.validation.ts`
- `reserva.validation.ts`
- `vehiculo.validation.ts`
- `usuario.validation.ts`
- `venta.validation.ts`


## 🧰Utils/
Funciones o módulos de ayuda que encapsulan lógica reutilizable y genérica.

- `jwt.ts`
- `jwt.utils.ts`
- `network.ts`


# Lógica del Programa🧠
Ejemplo de una lógica en particular para dar a entender el funcionamiento del sistema.

```text
[Cliente (HTTP request)]
    ⬇️
ROUTE (/api/clientes)
    ⬇️
MIDDLEWARE (PRE-CONTROLLER)
    ⬇️
VALIDATION (createClienteSchema)
    ⬇️
CONTROLLER (postCliente)
    ⬇️
SERVICE (registrarCliente)
    ⬇️
PRISMA / BASE DE DATOS
    ⬇️
MIDDLEWARE (POST-CONTROLLER)
```
