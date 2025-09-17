// src/scripts/seed-users.ts
import bcrypt from "bcrypt";
import prisma from "../config/prisma";

async function seedUsers() {
  console.log("🌱 Iniciando seed de usuarios...");
  
  try {
    // Verificar si ya existen usuarios
    const existingUsers = await prisma.usuario.count();
    console.log(`📊 Usuarios existentes en BD: ${existingUsers}`);
    
    // Usuario Admin
    const adminExists = await prisma.usuario.findUnique({
      where: { email: "admin@test.com" }
    });
    
    if (!adminExists) {
      const hashedPasswordAdmin = await bcrypt.hash("admin123", 10);
      
      await prisma.usuario.create({
        data: {
          nombre: "Admin Usuario",
          email: "admin@test.com",
          password: hashedPasswordAdmin,
          rol: "admin",
          activo: true,
        },
      });
      console.log("✅ Usuario admin creado: admin@test.com / admin123");
    } else {
      console.log("ℹ️  Usuario admin ya existe");
    }
    
    // Usuario Viewer
    const viewerExists = await prisma.usuario.findUnique({
      where: { email: "viewer@test.com" }
    });
    
    if (!viewerExists) {
      const hashedPasswordViewer = await bcrypt.hash("viewer123", 10);
      
      await prisma.usuario.create({
        data: {
          nombre: "Viewer Usuario",
          email: "viewer@test.com",
          password: hashedPasswordViewer,
          rol: "viewer",
          activo: true,
        },
      });
      console.log("✅ Usuario viewer creado: viewer@test.com / viewer123");
    } else {
      console.log("ℹ️  Usuario viewer ya existe");
    }
    
    // Mostrar resumen final
    const totalUsers = await prisma.usuario.count();
    console.log(`📈 Total usuarios en BD: ${totalUsers}`);
    
    const allUsers = await prisma.usuario.findMany({
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
        creadoEn: true,
      },
    });
    
    console.log("👥 Usuarios en la base de datos:");
    allUsers.forEach(user => {
      console.log(`   - ${user.nombre} (${user.email}) - ${user.rol} - ${user.activo ? 'Activo' : 'Inactivo'}`);
    });
    
  } catch (error) {
    console.error("❌ Error durante el seed:", error);
    throw error;
  }
}

async function main() {
  try {
    await seedUsers();
    console.log("🎉 Seed completado exitosamente!");
  } catch (error) {
    console.error("💥 Falló el seed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

export { seedUsers };
