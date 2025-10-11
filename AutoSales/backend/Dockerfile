# Backend Dockerfile - AutoSales API

FROM node:18-alpine AS dependencies

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar todas las dependencias y generar Prisma Client
RUN npm install && npx prisma generate

# ================================
# Contruir Aplicacion
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
#Produccion Runtime
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
COPY --from=builder --chown=autosales:nodejs /app/node_modules/.prisma ./node_modules/.prisma

# Copiar archivos necesarios
COPY --chown=autosales:nodejs package*.json ./

# Generar Prisma Client en la etapa de producción
RUN npx prisma generate

# Exponer puerto
EXPOSE 3000

# Comando de salud para Docker
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Comando por defecto
CMD ["npm", "start"]
