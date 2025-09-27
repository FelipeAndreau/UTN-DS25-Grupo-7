# Frontend Dockerfile - AutoSales React App
# Multi-stage build para optimizar el tamaño de la imagen

# ================================
# STAGE 1: Build Application
# ================================
FROM node:18-alpine AS builder

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci && npm cache clean --force

# Copiar código fuente
COPY . .

# Build de la aplicación para producción
RUN npm run build

# ================================
# STAGE 2: Production Server
# ================================
FROM nginx:alpine AS production

# Instalar curl para healthcheck
RUN apk add --no-cache curl

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar archivos compilados desde stage builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Crear directorio de logs con permisos
RUN mkdir -p /var/log/nginx && \
    touch /var/log/nginx/access.log && \
    touch /var/log/nginx/error.log

# Exponer puerto 80
EXPOSE 80

# Comando de salud para Docker
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80 || exit 1

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]