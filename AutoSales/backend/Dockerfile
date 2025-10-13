# Backend Dockerfile - AutoSales API
FROM node:18-alpine

# Instalar dependencias del sistema necesarias
RUN apk add --no-cache \
    openssl \
    curl \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias sin cache y con force para resolver conflictos
RUN npm install --force --no-cache

# Copiar el resto del código
COPY . .

# Generar cliente de Prisma
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build

# Exponer puerto
EXPOSE 3000

# Comando de salud para Docker
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Comando por defecto
CMD ["npm", "start"]
