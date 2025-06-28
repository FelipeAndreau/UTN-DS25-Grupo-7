import { useState } from "react";

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState<{ id: number; nombre: string; email: string }[]>([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: "", email: "" });

  const agregarUsuario = () => {
    if (nuevoUsuario.nombre && nuevoUsuario.email) {
      setUsuarios([
        ...usuarios,
        { id: usuarios.length + 1, nombre: nuevoUsuario.nombre, email: nuevoUsuario.email },
      ]);
      setNuevoUsuario({ nombre: "", email: "" });
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-5">Gestión de Usuarios</h2>

      {/* Formulario para agregar usuario */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Nombre"
          value={nuevoUsuario.nombre}
          onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
          className="p-2 border border-gray-300 rounded-md mr-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={nuevoUsuario.email}
          onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })}
          className="p-2 border border-gray-300 rounded-md mr-2"
        />
        <button
          onClick={agregarUsuario}
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Agregar Usuario
        </button>
      </div>

      {/* Tabla de usuarios */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Nombre</th>
            <th className="border border-gray-300 p-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id} className="text-center">
              <td className="border border-gray-300 p-2">{usuario.id}</td>
              <td className="border border-gray-300 p-2">{usuario.nombre}</td>
              <td className="border border-gray-300 p-2">{usuario.email}</td>
            </tr>
          ))}
          {usuarios.length === 0 && (
            <tr>
              <td colSpan={3} className="p-2 text-gray-500">
                No hay usuarios registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GestionUsuarios;