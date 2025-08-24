import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./config/prisma";
import { swaggerUi, specs } from "./config/swagger";
import authRoutes from "./routes/auth.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import clienteRoutes from "./routes/clientes.routes";
import vehiculoRoutes from "./routes/vehiculos.routes";
import usuarioRoutes from "./routes/usuarios.routes";
import reporteRoutes from "./routes/reportes.routes";
import configRoutes from "./routes/config.routes";
import { authMiddleware } from "./middlewares/authMiddleware";
import { errorHandler } from "./middlewares/errorHandlerMiddleware";
import ventasRoutes from "./routes/ventas.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// 📚 Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "AutoSales API Documentation",
}));

// Rutas públicas
app.use("/auth", authRoutes);

// Ruta de prueba
app.get("/test", (req, res) => {
  res.json({ message: "Servidor funcionando correctamente", timestamp: new Date() });
});

// Ruta para ver usuarios existentes
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.usuario.findMany({
      select: {
        id: true,
        email: true,
        nombre: true,
        rol: true,
        activo: true,
        creadoEn: true
      }
    });
    res.json({ users, count: users.length });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Error desconocido" });
  }
});

// Ruta temporal para crear usuario admin
app.post("/create-admin", async (req, res) => {
  try {
    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash("123456", 10);
    
    const user = await prisma.usuario.upsert({
      where: { email: "admin@test.com" },
      update: {
        password: hashedPassword,
        nombre: "Administrador",
        rol: "admin",
        activo: true
      },
      create: {
        nombre: "Administrador",
        email: "admin@test.com",
        password: hashedPassword,
        rol: "admin",
        activo: true
      }
    });
    
    res.json({ message: "Usuario admin creado/actualizado", user: { id: user.id, email: user.email, nombre: user.nombre } });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Error desconocido" });
  }
});

// Rutas protegidas
app.use("/dashboard", authMiddleware, dashboardRoutes);
app.use("/clientes", authMiddleware, clienteRoutes);
app.use("/vehiculos", authMiddleware, vehiculoRoutes);
app.use("/usuarios", authMiddleware, usuarioRoutes);
app.use("/reportes", authMiddleware, reporteRoutes);
app.use("/config", authMiddleware, configRoutes);
app.use("/ventas", authMiddleware, ventasRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Manejo de errores generales
app.use(errorHandler);

// 🚀 Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});