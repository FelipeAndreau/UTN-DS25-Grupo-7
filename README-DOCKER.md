# 🐳 **AutoSales - Guía de Docker**

## 📋 **Índice**
- [🎯 Descripción](#-descripción)
- [🏗️ Arquitectura](#️-arquitectura)
- [⚡ Inicio Rápido](#-inicio-rápido)
- [🔧 Configuración](#-configuración)
- [📦 Servicios](#-servicios)
- [💻 Comandos Útiles](#-comandos-útiles)
- [🛠️ Desarrollo](#️-desarrollo)
- [🚀 Producción](#-producción)
- [❗ Troubleshooting](#-troubleshooting)

---

## 🎯 **Descripción**

Este proyecto utiliza **Docker Compose** para orquestar toda la aplicación AutoSales, incluyendo:
- ✅ **Backend** (Node.js + TypeScript + Express)
- ✅ **Frontend** (React + TypeScript + Vite)
- ✅ **Base de Datos** (PostgreSQL)
- ✅ **Administrador BD** (Adminer)

---

## 🏗️ **Arquitectura**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FRONTEND      │    │    BACKEND      │    │   POSTGRESQL    │
│   (React/Nginx) │◄──►│ (Node.js/API)   │◄──►│   (Database)    │
│   Puerto: 80    │    │   Puerto: 3000  │    │   Puerto: 5432  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                       ▲                       ▲
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │    ADMINER      │
                    │  (BD Manager)   │
                    │  Puerto: 8080   │
                    └─────────────────┘
```

---

## ⚡ **Inicio Rápido**

### **1️⃣ Prerequisitos**
```bash
# Verificar que Docker esté instalado
docker --version
docker-compose --version
```

### **2️⃣ Clonar y Configurar**
```bash
# Clonar el repositorio
git clone https://github.com/TU-USUARIO/UTN-DS25-Grupo-7.git
cd UTN-DS25-Grupo-7

# Copiar archivos de configuración
cp AutoSales/backend/.env.example AutoSales/backend/.env
cp AutoSales/frontend/.env.example AutoSales/frontend/.env
```

### **3️⃣ Levantar toda la aplicación**
```bash
# Construir y ejecutar todos los servicios
docker-compose up --build -d

# Ver logs en tiempo real
docker-compose logs -f
```

### **4️⃣ Acceder a la aplicación**
- **🌐 Frontend**: http://localhost:80
- **📡 Backend API**: http://localhost:3000
- **🗄️ Documentación Swagger**: http://localhost:3000/api-docs
- **⚙️ Adminer (BD)**: http://localhost:8080

---

## 🔧 **Configuración**

### **📁 Archivos de Entorno**

#### **Backend** (`AutoSales/backend/.env`)
```bash
DATABASE_URL="postgresql://autosales_user:autosales_password@postgres:5432/autosales_db"
JWT_SECRET="tu-secret-key-aqui"
PORT=3000
NODE_ENV=production
```

#### **Frontend** (`AutoSales/frontend/.env`)
```bash
VITE_API_BASE_URL=http://localhost:3000
VITE_NODE_ENV=production
```

### **🔐 Variables de Entorno Importantes**
| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `DATABASE_URL` | Conexión a PostgreSQL | `postgresql://...` |
| `JWT_SECRET` | Clave para tokens | `cambiar-en-produccion` |
| `CORS_ORIGIN` | URLs permitidas | `http://localhost:*` |
| `VITE_API_BASE_URL` | URL del backend | `http://localhost:3000` |

---

## 📦 **Servicios**

### **🗄️ PostgreSQL Database**
- **Imagen**: `postgres:15-alpine`
- **Puerto**: `5432`
- **Usuario**: `autosales_user`
- **Contraseña**: `autosales_password`
- **Base de datos**: `autosales_db`

### **📡 Backend API**
- **Build**: `AutoSales/backend/Dockerfile`
- **Puerto**: `3000`
- **Healthcheck**: `/api/health`
- **Dependencias**: PostgreSQL

### **🌐 Frontend Web**
- **Build**: `AutoSales/frontend/Dockerfile`
- **Puerto**: `80`
- **Servidor**: Nginx
- **Dependencias**: Backend

### **⚙️ Adminer (Opcional)**
- **Imagen**: `adminer:latest`
- **Puerto**: `8080`
- **Usuario**: `autosales_user`
- **Servidor**: `postgres`

---

## 💻 **Comandos Útiles**

### **🚀 Iniciar Servicios**
```bash
# Levantar todos los servicios
docker-compose up -d

# Levantar con rebuild
docker-compose up --build -d

# Levantar solo backend y BD
docker-compose up -d postgres backend
```

### **📊 Monitoreo**
```bash
# Ver estado de contenedores
docker-compose ps

# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### **🔄 Gestión de Servicios**
```bash
# Reiniciar un servicio
docker-compose restart backend

# Parar todos los servicios
docker-compose down

# Parar y eliminar volúmenes
docker-compose down -v

# Parar y eliminar imágenes
docker-compose down --rmi all
```

### **🐛 Debug y Desarrollo**
```bash
# Ejecutar comandos dentro del backend
docker-compose exec backend npm run build
docker-compose exec backend npx prisma studio

# Acceder al shell del contenedor
docker-compose exec backend sh
docker-compose exec postgres psql -U autosales_user -d autosales_db

# Ver uso de recursos
docker stats
```

---

## 🛠️ **Desarrollo**

### **📝 Modificar Código**
```bash
# Para cambios en el backend
docker-compose restart backend

# Para cambios en el frontend (requiere rebuild)
docker-compose up --build frontend
```

### **🗄️ Gestión de Base de Datos**
```bash
# Aplicar migraciones
docker-compose exec backend npx prisma migrate deploy

# Seed inicial de datos
docker-compose exec backend npm run create-users

# Abrir Prisma Studio
docker-compose exec backend npx prisma studio
```

### **🧪 Testing**
```bash
# Ejecutar tests del backend
docker-compose exec backend npm test

# Tests con coverage
docker-compose exec backend npm run test:coverage
```

---

## 🚀 **Producción**

### **🔐 Configuración de Seguridad**
1. **Cambiar JWT_SECRET** por uno seguro
2. **Configurar CORS_ORIGIN** con dominios específicos
3. **Usar HTTPS** en producción
4. **Cambiar contraseñas** de PostgreSQL

### **📈 Optimizaciones**
```bash
# Build optimizado para producción
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Usar volumes para persistencia
docker-compose up -d --volumes
```

---

## ❗ **Troubleshooting**

### **🔴 Problemas Comunes**

#### **Error: "Port already in use"**
```bash
# Verificar qué proceso usa el puerto
netstat -tulpn | grep :3000

# Cambiar puerto en docker-compose.yml
ports:
  - "3001:3000"  # Usar puerto 3001 en lugar de 3000
```

#### **Error: "Database connection failed"**
```bash
# Verificar estado de PostgreSQL
docker-compose logs postgres

# Reiniciar base de datos
docker-compose restart postgres

# Verificar variables de entorno
docker-compose exec backend env | grep DATABASE
```

#### **Error: "Frontend no puede conectar al backend"**
```bash
# Verificar URL en frontend/.env
VITE_API_BASE_URL=http://localhost:3000

# Verificar CORS en backend
docker-compose logs backend | grep CORS
```

#### **Error: "Permission denied"**
```bash
# En Linux/Mac, problemas de permisos
sudo chown -R $USER:$USER .

# Verificar que Docker tenga permisos
docker info
```

### **🧹 Limpieza del Sistema**
```bash
# Limpiar contenedores no utilizados
docker container prune

# Limpiar imágenes no utilizadas
docker image prune

# Limpiar volúmenes no utilizados
docker volume prune

# Limpieza completa (¡CUIDADO!)
docker system prune -a --volumes
```

---

## 📞 **Soporte**

### **🏢 Equipo de Desarrollo**
- **Arquitectura**: [Nombre del responsable]
- **Backend**: [Nombre del responsable]
- **Frontend**: [Nombre del responsable]
- **DevOps**: [Nombre del responsable]

### **📚 Recursos Adicionales**
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [Nginx Docker Hub](https://hub.docker.com/_/nginx)

---

## ✅ **Checklist de Deployment**

- [ ] Archivos `.env` configurados
- [ ] JWT_SECRET cambiado
- [ ] CORS configurado correctamente
- [ ] PostgreSQL funcionando
- [ ] Migraciones aplicadas
- [ ] Usuario admin creado
- [ ] Frontend conectando al backend
- [ ] Swagger documentación accesible
- [ ] Logs sin errores críticos
- [ ] Healthchecks funcionando

---

*📅 Última actualización: Septiembre 2025*
*🏷️ Versión: 1.0.0*