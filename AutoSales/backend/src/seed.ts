import bcrypt from "bcrypt";
import prisma from "./config/prisma";

async function seedDatabase() {
  try {
    // Crear usuario administrador
    const hashedPassword = await bcrypt.hash("123456", 10);
    
    const adminUser = await prisma.usuario.create({
      data: {
        nombre: "Administrador",
        email: "admin@test.com",
        password: hashedPassword,
        rol: "admin",
        activo: true
      }
    });

    console.log("Usuario administrador creado:", adminUser);

    // Crear algunos clientes de ejemplo
    const cliente1 = await prisma.cliente.create({
      data: {
        nombre: "Juan Pérez",
        email: "juan@example.com",
        telefono: "+1234567890",
        tipo: "Particular",
        estado: "Activo",
        actividad: "Empleado"
      }
    });

    const cliente2 = await prisma.cliente.create({
      data: {
        nombre: "María García",
        email: "maria@example.com",
        telefono: "+1234567891",
        tipo: "Empresa",
        estado: "Potencial",
        actividad: "Comercio"
      }
    });

    console.log("Clientes creados:", cliente1, cliente2);

    // Crear algunos vehículos de ejemplo
    const vehiculo1 = await prisma.vehiculo.create({
      data: {
        marca: "Toyota",
        modelo: "Corolla",
        anio: 2023,
        precio: 25000,
        estado: "Disponible",
        imagen: "toyota_corolla.jpg",
        descripcion: "Sedán compacto, eficiente y confiable"
      }
    });

    const vehiculo2 = await prisma.vehiculo.create({
      data: {
        marca: "Honda",
        modelo: "Civic",
        anio: 2023,
        precio: 27000,
        estado: "Disponible",
        imagen: "honda_civic.jpg",
        descripcion: "Sedán deportivo con tecnología avanzada"
      }
    });

    console.log("Vehículos creados:", vehiculo1, vehiculo2);

    // Crear una venta de ejemplo
    const venta1 = await prisma.venta.create({
      data: {
        clienteId: cliente1.id,
        vehiculoId: vehiculo1.id,
        fecha: new Date(),
        monto: 25000
      }
    });

    console.log("Venta creada:", venta1);

  } catch (error) {
    console.error("Error al crear datos de ejemplo:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
