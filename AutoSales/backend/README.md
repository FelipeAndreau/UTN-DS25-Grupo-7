# Backend - AutoSales⚙️💻
—-------------

## Estructura de carpetas🗂️
Resumen de la estructura del proyecto, destacando y definiendo las capas que consideramos que tienen mayor importancia.
—-------------

# 🗄️Prisma ORM/
—---------------
Contiene el esquema de la base de la base de datos:
schema.prisma → archivo de configuración donde se definen datos, tablas  y relaciones.

# 📂SRC/ 
—---------------
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
