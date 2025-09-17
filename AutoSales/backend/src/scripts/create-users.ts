// src/scripts/create-users.ts
import bcrypt from "bcrypt";
import prisma from "../config/prisma";

async function createUsers() {
  console.log("🚀 Creando usuarios iniciales...");
  
  try {
    // Verificar si ya existen
    const existingAdmin = await prisma.usuario.findUnique({
      where: { email: "admin@test.com" }
    });
    
    const existingViewer = await prisma.usuario.findUnique({
      where: { email: "viewer@test.com" }
    });
    
    // Crear admin si no existe
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const admin = await prisma.usuario.create({
        data: {
          nombre: "Administrador",
          email: "admin@test.com", 
          password: hashedPassword,
          rol: "admin",
          activo: true
        }
      });
      console.log("✅ Usuario admin creado:", admin.email);
    } else {
      console.log("ℹ️  Usuario admin ya existe");
    }
    
    // Crear viewer si no existe
    if (!existingViewer) {
      const hashedPassword = await bcrypt.hash("viewer123", 10);
      const viewer = await prisma.usuario.create({
        data: {
          nombre: "Usuario Viewer",
          email: "viewer@test.com",
          password: hashedPassword, 
          rol: "viewer",
          activo: true
        }
      });
      console.log("✅ Usuario viewer creado:", viewer.email);
    } else {
      console.log("ℹ️  Usuario viewer ya existe");
    }
    
  } catch (error) {
    console.error("❌ Error creando usuarios:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  createUsers();
}

export { createUsers };
