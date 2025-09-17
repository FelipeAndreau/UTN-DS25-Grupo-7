# 🚀 **AutoSales - Guía de Deployment en Vercel**

## 📋 **Descripción**

Esta guía te ayudará a deployar la aplicación **AutoSales** en Vercel. El proyecto está configurado para deployar solo el frontend, mientras que el backend debe ser deployado por separado en otro servicio.

---

## 🏗️ **Arquitectura de Deployment**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   VERCEL        │    │   RAILWAY       │    │   NEON/SUPABASE │
│   Frontend      │◄──►│   Backend API   │◄──►│   PostgreSQL    │
│   (React SPA)   │    │   (Node.js)     │    │   Database      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## ⚡ **Deployment en Vercel**

### 1. **Preparación del Repositorio**

```bash
# 1. Asegúrate de estar en la rama correcta
git checkout Felipe-Andreau

# 2. Verifica que todos los archivos estén agregados
git add .
git commit -m "feat: Configuración para deployment en Vercel"
git push origin Felipe-Andreau
```

### 2. **Configuración en Vercel**

1. Ve a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub
2. Haz clic en **"New Project"**
3. Selecciona tu repositorio **UTN-DS25-Grupo-7**
4. Selecciona la rama **Felipe-Andreau**
5. Vercel detectará automáticamente que es un proyecto Vite

### 3. **Variables de Entorno en Vercel**

En la sección **Environment Variables** de tu proyecto en Vercel, agrega:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_PROD_URL=https://tu-backend-api.railway.app/api

# Environment
NODE_ENV=production
VITE_NODE_ENV=production

# Features
VITE_DEV_MODE=false
VITE_SHOW_LOGS=false
VITE_DEBUG_MODE=false

# App Configuration
VITE_APP_NAME=AutoSales
VITE_APP_VERSION=1.0.0
VITE_COMPANY_NAME=AutoSales Company
```

### 4. **Build Settings (Automáticos)**

Vercel detectará automáticamente:
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm ci`

---

## 🔧 **Deployment del Backend**

### Opción 1: Railway (Recomendado)

1. Ve a [railway.app](https://railway.app)
2. Conecta tu repositorio GitHub
3. Selecciona la carpeta `AutoSales/backend`
4. Agrega las variables de entorno del backend
5. Railway detectará automáticamente Node.js

### Opción 2: Render

1. Ve a [render.com](https://render.com)
2. Crea un nuevo Web Service
3. Conecta tu repositorio
4. Configura el directorio: `AutoSales/backend`
5. Build Command: `npm install && npm run build`
6. Start Command: `npm start`

### Opción 3: Heroku

```bash
# 1. Instalar Heroku CLI
# 2. Login
heroku login

# 3. Crear app
heroku create autosales-backend

# 4. Configurar variables de entorno
heroku config:set NODE_ENV=production
heroku config:set DATABASE_URL=tu-url-de-postgres

# 5. Deploy
git subtree push --prefix=AutoSales/backend heroku main
```

---

## 🗄️ **Base de Datos**

### Opción 1: Neon (Recomendado - Gratis)

1. Ve a [neon.tech](https://neon.tech)
2. Crea una nueva base de datos PostgreSQL
3. Copia la connection string
4. Agrega a las variables de entorno del backend:
   ```env
   DATABASE_URL=postgresql://usuario:password@host:5432/database
   ```

### Opción 2: Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a Settings > Database
4. Copia la URI de conexión
5. Úsala como `DATABASE_URL`

### Opción 3: Railway PostgreSQL

1. En tu proyecto de Railway
2. Agrega un servicio PostgreSQL
3. Railway generará automáticamente la URL de conexión

---

## 🔐 **Variables de Entorno Completas**

### Frontend (Vercel)
```env
# API URLs
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_PROD_URL=https://tu-backend.railway.app/api

# Environment
NODE_ENV=production
VITE_NODE_ENV=production

# Features
VITE_DEV_MODE=false
VITE_SHOW_LOGS=false

# App Info
VITE_APP_NAME=AutoSales
VITE_APP_VERSION=1.0.0
```

### Backend (Railway/Render/Heroku)
```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db
DIRECT_URL=postgresql://user:pass@host:5432/db

# JWT
JWT_SECRET=tu-jwt-secret-super-seguro-para-produccion-cambiar

# Server
PORT=3000
HOST=0.0.0.0
NODE_ENV=production

# CORS
CORS_ORIGIN=https://tu-frontend.vercel.app

# Features
NETWORK_MODE=production
PRISMA_DISABLE_PREPARED_STATEMENTS=true
```

---

## ✅ **Checklist de Deployment**

### Preparación
- [ ] Rama `Felipe-Andreau` creada
- [ ] Código commiteado y pusheado
- [ ] Variables de entorno configuradas
- [ ] Base de datos creada

### Frontend (Vercel)
- [ ] Proyecto creado en Vercel
- [ ] Variables de entorno configuradas
- [ ] Build exitoso
- [ ] Deployment funcionando

### Backend (Railway/Render)
- [ ] Servicio creado
- [ ] Variables de entorno configuradas
- [ ] Database conectada
- [ ] Migraciones ejecutadas
- [ ] API respondiendo

### Testing
- [ ] Frontend carga correctamente
- [ ] Login funciona
- [ ] API calls funcionan
- [ ] CORS configurado correctamente

---

## 🌐 **URLs de Ejemplo**

- **Frontend**: `https://autosales-frontend.vercel.app`
- **Backend**: `https://autosales-backend.railway.app`
- **API Docs**: `https://autosales-backend.railway.app/api-docs`
- **Health Check**: `https://autosales-backend.railway.app/health`

---

## 🚨 **Troubleshooting**

### Error: "API calls failing"
- Verificar `VITE_API_PROD_URL` en Vercel
- Verificar CORS en el backend
- Comprobar que el backend esté running

### Error: "Database connection failed"
- Verificar `DATABASE_URL`
- Comprobar que la database esté accesible
- Ejecutar migraciones: `npx prisma migrate deploy`

### Error: "Build failed"
- Verificar que todas las dependencias estén en `package.json`
- Comprobar variables de entorno requeridas
- Revisar logs de build en Vercel/Railway

---

## 📞 **Soporte**

Si tienes problemas con el deployment:

1. Revisa los logs en Vercel/Railway
2. Verifica las variables de entorno
3. Comprueba la conectividad de la base de datos
4. Consulta la documentación oficial de cada servicio

---

*🏷️ Versión: 1.0.0 | Actualizado: 2025-09-16*