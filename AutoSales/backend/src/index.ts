import express from "express";
import cors from "cors";
import dotenv from "dotenv";
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
const PORT = process.env.PORT || 3000;

// Middlewares globales
// Configuración de CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://autosales-frontend.vercel.app',
  /^https:\/\/autosales-frontend-.*\.vercel\.app$/
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return allowed === origin;
      }
      return allowed.test(origin);
    });
    
    if (isAllowed) {
      return callback(null, true);
    }
    
    console.log('❌ Origin bloqueado por CORS:', origin);
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

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
app.get("/health", (req, res) => {
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
app.listen(PORT, () => {
  console.log(`🚀 Servidor AutoSales iniciado en http://localhost:${PORT}`);
  console.log(`📚 Documentación Swagger: http://localhost:${PORT}/api-docs`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health`);
});
