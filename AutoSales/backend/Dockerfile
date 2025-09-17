# Backend Dockerfile - AutoSales API
# Multi-stage build para optimizar el tamaño de la imagen

# ================================
# STAGE 1: Build Dependencies
# ================================
FROM node:18-alpine AS dependencies

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# ================================
# STAGE 2: Build Application
# ================================
FROM node:18-alpine AS builder

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig.json ./

# Instalar todas las dependencias (incluyendo devDependencies)
RUN npm ci

# Copiar código fuente
COPY src/ ./src/
COPY prisma/ ./prisma/

# Generar cliente de Prisma
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build

# ================================
# STAGE 3: Production Runtime
# ================================
FROM node:18-alpine AS production

# Instalar dependencias del sistema necesarias
RUN apk add --no-cache \
    openssl \
    curl \
    && rm -rf /var/cache/apk/*

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S autosales -u 1001

# Crear directorio de trabajo
WORKDIR /app

# Cambiar propietario del directorio
RUN chown -R autosales:nodejs /app

# Cambiar al usuario no-root
USER autosales

# Copiar dependencias de producción desde stage 1
COPY --from=dependencies --chown=autosales:nodejs /app/node_modules ./node_modules

# Copiar aplicación compilada desde stage 2
COPY --from=builder --chown=autosales:nodejs /app/dist ./dist
COPY --from=builder --chown=autosales:nodejs /app/prisma ./prisma

# Copiar archivos necesarios
COPY --chown=autosales:nodejs package*.json ./

# Exponer puerto
EXPOSE 3000

# Comando de salud para Docker
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Comando por defecto
CMD ["npm", "start"]