# 🚗 AutoSales

**AutoSales** es una plataforma moderna para la gestión de ventas de vehículos, clientes y usuarios, desarrollada con **React + TypeScript + Vite**. Incluye panel administrativo, reportes visuales y personalización de tema e idioma.

---

## 📁 Estructura del Proyecto

```
frontend/
│
├── components/      # Componentes reutilizables (UI y containers)
├── pages/           # Vistas principales del sistema
├── context/         # Contextos globales (auth, tema, idioma)
├── services/        # Lógica de conexión con APIs
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
| **GestionVehiculos**| Container      | –                                  | CRUD de vehículos con carga de imágenes base64   |
| **Reportes**       | Container       | –                                  | Selector de reportes con gráficas                |

---

## 🧬 Atomic Design Map

- **Atoms:** Botones, inputs, íconos
- **Molecules:** Formularios, tarjetas
- **Organisms:** Tablas, sliders, modales
- **Templates:** Layouts de páginas
- **Pages:** Login, Dashboard, Área Usuario

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

## 🔄 Estado Global & Hooks

- **AuthContext:** Maneja sesión y permisos
- **ThemeContext:** Claro / Oscuro
- **LanguageContext:** Español / Inglés / Francés
- **Custom Hooks:** `useAuth`, `useTheme`, `useLanguage`

---

## 🎨 Diseño & Temas

### 🎨 Paleta de Colores

| Nombre     | HEX        |
|------------|------------|
| Primario   | #1E3A8A    |
| Secundario | #3B82F6    |
| Fondo      | #F9FAFB    |
| Texto      | #111827    |

### 🖋️ Tipografías

- **Principal:** Inter
- **Secundaria:** Roboto

### 🌗 Theming

> Usa `ThemeContext` + clases Tailwind para alternar entre modo claro y oscuro.

---

## ⚙️ Instalación Rápida

### 📋 Requisitos

- Node.js 18+
- pnpm / npm

### 🚀 Pasos

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
- [ ] Integración con backend real
- [ ] Tests automáticos
- [ ] CI/CD con GitHub Actions
- [ ] Mejoras en UI/UX

---

<div align="center">
  <img src="https://img.shields.io/badge/React-18-blue?logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/Vite-5-purple?logo=vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-blue?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Chart.js-4-orange?logo=chart.js" />
</div>

---
