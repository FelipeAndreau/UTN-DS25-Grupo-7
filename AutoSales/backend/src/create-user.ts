import bcrypt from "bcrypt";
import prisma from "./config/prisma";

async function createUser() {
  try {
    // Crear un nuevo usuario con hash correcto
    const hashedPassword = await bcrypt.hash("123456", 10);
    console.log("Password hash creado:", hashedPassword);
    
    const adminUser = await prisma.usuario.upsert({
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

    console.log("✅ Usuario administrador creado/actualizado exitosamente:", adminUser);

    // Verificar que el password funciona
    const passwordTest = await bcrypt.compare("123456", hashedPassword);
    console.log("🔐 Test de password:", passwordTest);

  } catch (error) {
    console.error("❌ Error al crear usuario:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser();
