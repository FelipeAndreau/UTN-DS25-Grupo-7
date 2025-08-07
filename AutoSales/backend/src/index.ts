import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import clienteRoutes from "./routes/clientes.routes";
import vehiculoRoutes from "./routes/vehiculos.routes";
import usuarioRoutes from "./routes/usuarios.routes";
import reporteRoutes from "./routes/reportes.routes";
import configRoutes from "./routes/config.routes";
import { authMiddleware } from "./middlewares/authMiddleware";
import { errorHandler } from "./middlewares/errorHandlerMiddleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas públicas
app.use("/auth", authRoutes);

// Rutas protegidas
app.use("/dashboard", authMiddleware, dashboardRoutes);
app.use("/clientes", authMiddleware, clienteRoutes);
app.use("/vehiculos", authMiddleware, vehiculoRoutes);
app.use("/usuarios", authMiddleware, usuarioRoutes);
app.use("/reportes", authMiddleware, reporteRoutes);
app.use("/config", authMiddleware, configRoutes);

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