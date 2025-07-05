<h1 align="center">
  <br>
  <img src="https://cdn-icons-png.flaticon.com/512/18042/18042764.png" alt="AutoSales" width="120">
  <br>
  AutoSales
  <br>
</h1>

<h4 align="center">Plataforma moderna para la gestión de ventas de vehículos, clientes y usuarios, desarrollada con <b>React + TypeScript + Vite</b>.</h4>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue?logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/Vite-5-purple?logo=vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-blue?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Chart.js-4-orange?logo=chart.js" />
</p>

<p align="center">
  <a href="#estructura">Estructura</a> •
  <a href="#componentes">Componentes</a> •
  <a href="#rutas">Rutas</a> •
  <a href="#charts">Charts</a> •
  <a href="#hooks">Hooks & useEffect</a> •
  <a href="#api">API (api.ts)</a> •
  <a href="#temas">Temas</a> •
  <a href="#instalacion">Instalación</a> •
  <a href="#roadmap">Roadmap</a>
</p>

---

## 📁 Estructura del Proyecto

```
frontend/
│
├── components/      # Componentes reutilizables (UI y containers)
├── pages/           # Vistas principales del sistema
├── context/         # Contextos globales (auth, tema, idioma)
├── services/        # Lógica de conexión con APIs (fetch)
├── assets/          # Imágenes, íconos y recursos estáticos
└── ...
```

---

## 🧩 Componentes Destacados

| Nombre             | Tipo            | Props clave                        | Descripción                                      |
|--------------------|-----------------|------------------------------------|--------------------------------------------------|
| **Configuracion**  | Presentational  | onCambiarTema, onCambiarIdioma     | Panel para cambiar tema e idioma                 |
| **GestionUsuarios**| Container       | –                                  | ABM de usuarios con tabla dinámica               |
| **GestionClientes**| Container       | –                                  | Filtro avanzado y modal de edición de clientes   |
| **GestionVehiculos**| Container      | –                                  | CRUD de vehículos con carga de imágenes base64 y conexión a API |
| **Reportes**       | Container       | –                                  | Selector de reportes con gráficas                |

---

## 🗺️ Rutas Principales

| Ruta                | Título                | Objetivo                                         | Componentes clave                |
|---------------------|-----------------------|--------------------------------------------------|----------------------------------|
| `/login`            | Login                 | Autenticación básica con redirección             | Formulario de login              |
| `/dashboard`        | Dashboard Admin       | Panel principal del administrador                | Gráficos, resumen, navegación    |
| `/dashboard/gestion`| Gestión Admin         | Gestión de usuarios, clientes y vehículos        | GestionUsuarios, GestionClientes, GestionVehiculos |
| `/dashboard/reportes`| Reportes             | Visualización de reportes y estadísticas         | Reportes, Chart.js               |
| `/usuario`          | Área de Usuario       | Visualización de vehículos y reservas            | Slider, Perfil, Reservas         |

> **Nota:** La navegación y las rutas están gestionadas con React Router. El dashboard del admin permite acceder a las secciones de gestión y reportes desde el menú lateral.

---

## 📊 Visualización de Datos con Chart.js

AutoSales utiliza **Chart.js** (a través de `react-chartjs-2`) para mostrar datos de manera visual e interactiva en el Dashboard y en la sección de Reportes.

- **Gráficos de Barras y Pastel:** Se usan para mostrar ventas mensuales, estado de vehículos y clientes por estado.
- **Datos Cargados:** Los datos de los gráficos actualmente están cargados localmente en arrays y objetos dentro de los componentes. Esto permite simular el comportamiento real de la app y facilita el desarrollo visual, aunque está preparado para integrarse con una API en el futuro.
- **Ejemplo de uso:**
  ```tsx
  import { Bar } from "react-chartjs-2";
  <Bar data={ventasData} options={chartOptions} />
  ```
- **Personalización:** Los colores, etiquetas y datasets se pueden modificar fácilmente para adaptarse a los datos reales del negocio.

---

## 🪝 Uso de Hooks y useEffect

El proyecto hace un uso intensivo de **hooks** de React para el manejo de estado y efectos:

- **useState:** Para manejar el estado local de formularios, tablas y datos en todos los componentes principales.
- **useEffect:** Para cargar datos desde la API al montar los componentes, por ejemplo en `GestionVehiculos`:
  ```tsx
  useEffect(() => {
    carService.getAllCars().then((cars) => {
      const vehiculos = cars.map(car => ({
        id: car.id ?? 0,
        marca: car.make,
        modelo: car.model,
        anio: car.year,
        precio: car.price,
        estado: car.isAvailable ? "Disponible" : "Vendido",
        imagen: car.imageUrl ?? "",
        descripcion: car.description ?? "",
      }));
      setVehiculos(vehiculos);
    });
  }, []);
  ```
- **Custom Hooks:** El proyecto está preparado para incorporar hooks personalizados si se requiere reutilizar lógica.
- **useContext:** Puede ser utilizado para manejar estado global como autenticación, tema o idioma.

---

## 🛠️ API (api.ts)

Toda la lógica de comunicación con el backend está centralizada en el archivo [`src/services/api.ts`](src/services/api.ts):

- **Fetch API:** Se utiliza `fetch` para todas las peticiones HTTP, incluyendo autenticación con token y manejo de errores.
- **carService:** Es un objeto que agrupa funciones para interactuar con la API de vehículos:
  - `getAllCars()`: Obtiene todos los autos.
  - `getCarById(id)`: Obtiene un auto por su ID.
  - `createCar(car)`: Crea un nuevo auto.
  - `searchCars(query)`: Busca autos por un término.
- **Ventajas:** Mantiene el código organizado, reutilizable y desacoplado de los componentes.  
- **Ejemplo de uso en un componente:**
  ```tsx
  useEffect(() => {
    carService.getAllCars().then((cars) => {
      // ...transformación y setVehiculos
    });
  }, []);
  ```

---

## 🧬 Atomic Design Map

- **Atoms:** Botones, inputs, íconos
- **Molecules:** Formularios, tarjetas
- **Organisms:** Tablas, sliders, modales
- **Templates:** Layouts de páginas
- **Pages:** Login, Dashboard, Área Usuario

---

## 🎨 Diseño & Temas

### Paleta de Colores

| Nombre     | HEX        |
|------------|------------|
| Primario   | #1E3A8A    |
| Secundario | #3B82F6    |
| Fondo      | #F9FAFB    |
| Texto      | #111827    |

### Tipografías

- **Principal:** Inter
- **Secundaria:** Roboto

### Theming

> Usa `ThemeContext` + clases Tailwind para alternar entre modo claro y oscuro.

---

## ⚙️ Instalación Rápida

### Requisitos

- Node.js 18+
- pnpm / npm

### Pasos

```bash
git clone https://github.com/FelipeAndreau/UTN-DS25-Grupo-7.git
cd AutoSales/frontend
pnpm install # o npm install
pnpm dev     # o npm run dev
```

---

## 🧪 Tests & Coverage

> ⚠️ *Tests aún no implementados. Se planea usar Vitest + Testing Library.*

---

## 🔁 CI/CD

> ℹ️ *Aún no se definió un workflow de CI/CD. Se recomienda usar GitHub Actions con pasos para lint, build y test.*

---

## 🔐 Variables de Entorno

| Variable        | Obligatoria | Ejemplo                      | Descripción                  |
|-----------------|-------------|------------------------------|------------------------------|
| VITE_API_URL    | ✅          | http://localhost:3000/api    | URL base del backend         |
| VITE_APP_NAME   | ❌          | AutoSales                    | Nombre de la app (branding)  |

---

## 🛣️ Roadmap

- [x] ABM de usuarios/clientes/vehículos
- [x] Conexión a API con Fetch y carga de datos
- [x] Uso de hooks y useEffect en componentes clave
- [ ] Tests automáticos
- [ ] CI/CD con GitHub Actions
- [ ] Mejoras en UI/UX

---

<p align="center">
  <sub>Hecho con 💙 por el equipo de AutoSales</sub>
</p>
