import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// Configuración de Prisma para producción
import prisma from "./config/prisma";

// Hacer disponible globalmente para otros módulos
(global as any).prisma = prisma;
import { swaggerUi, specs } from "./config/swagger";
import authRoutes from "./routes/auth.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import clienteRoutes from "./routes/clientes.routes";
import vehiculoRoutes from "./routes/vehiculos.routes";
import usuarioRoutes from "./routes/usuarios.routes";
import reporteRoutes from "./routes/reportes.routes";
import configRoutes from "./routes/config.routes";
import reservasRoutes from "./routes/reservas.routes";
import logsRoutes from "./routes/logs.routes";
import { authMiddleware } from "./middlewares/auth.middleware";
import { errorHandler } from "./middlewares/errorHandlerMiddleware";
import ventasRoutes from "./routes/ventas.routes";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Middlewares globales
app.use(cors());
// Aumentar límite para imágenes base64 (10MB por defecto, 50MB para imágenes grandes)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 📚 Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "AutoSales API Documentation",
}));

// ====== RUTAS PÚBLICAS ======
app.use("/api/auth", authRoutes);

// Catálogo público de vehículos (sin autenticación)
app.use("/api/public/vehiculos", vehiculoRoutes);

// Crear reservas públicas (sin autenticación) 
app.use("/api/public/reservas", reservasRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "AutoSales API funcionando correctamente", 
    timestamp: new Date(),
    version: "1.0.0"
  });
});

// ====== RUTAS PROTEGIDAS ======
app.use("/api/dashboard", authMiddleware, dashboardRoutes);
app.use("/api/clientes", authMiddleware, clienteRoutes);
app.use("/api/vehiculos", authMiddleware, vehiculoRoutes);
app.use("/api/usuarios", authMiddleware, usuarioRoutes);
app.use("/api/reportes", authMiddleware, reporteRoutes);
app.use("/api/config", authMiddleware, configRoutes);
app.use("/api/reservas", authMiddleware, reservasRoutes);
app.use("/api/ventas", authMiddleware, ventasRoutes);
app.use("/api/logs", logsRoutes); // Logs ya tienen auth y role check internos

// ====== MANEJO DE ERRORES ======
// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: "Endpoint no encontrado",
    path: req.path,
    method: req.method
  });
});

// Manejo de errores generales
app.use(errorHandler);

// ====== INICIAR SERVIDOR ======
// Iniciar servidor para Render (siempre en producción)
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor AutoSales iniciado en puerto ${PORT}`);
  console.log(`📚 Documentación Swagger: http://localhost:${PORT}/api-docs`);
  console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Modo: ${process.env.NODE_ENV || 'development'}`);
});

// Manejo de señales para shutdown graceful
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM recibido, cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT recibido, cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

// Exportar app para casos especiales
export { app };
