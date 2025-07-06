import { useState } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState<{ id: number; nombre: string; email: string }[]>([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: "", email: "" });
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<{ id: number; nombre: string; email: string } | null>(null);
  const [modalTipo, setModalTipo] = useState(""); // "ver" o "editar"

  const agregarUsuario = () => {
    if (nuevoUsuario.nombre && nuevoUsuario.email) {
      setUsuarios((prev) => [
        ...prev,
        {
          id: prev.length > 0 ? prev[prev.length - 1].id + 1 : 1,
          nombre: nuevoUsuario.nombre,
          email: nuevoUsuario.email,
        },
      ]);
      setNuevoUsuario({ nombre: "", email: "" });
    } else {
      alert("Por favor, completa todos los campos.");
    }
  };

  const eliminarUsuario = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
      alert("Usuario eliminado localmente");
    }
  };

  const abrirModal = (usuario: { id: number; nombre: string; email: string }, tipo: string) => {
    setUsuarioSeleccionado(usuario);
    setModalTipo(tipo);
  };

  const cerrarModal = () => {
    setUsuarioSeleccionado(null);
    setModalTipo("");
  };

  const guardarCambios = () => {
    if (!usuarioSeleccionado) return;

    setUsuarios((prev) =>
      prev.map((u) => (u.id === usuarioSeleccionado.id ? usuarioSeleccionado : u))
    );
    cerrarModal();
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
            <th className="border border-gray-300 p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id} className="text-center">
              <td className="border border-gray-300 p-2">{usuario.id}</td>
              <td className="border border-gray-300 p-2">{usuario.nombre}</td>
              <td className="border border-gray-300 p-2">{usuario.email}</td>
              <td className="border border-gray-300 p-2">
                <div className="flex items-center justify-center gap-2">
                  <button
                    className="p-2 bg-gray-200 rounded-md hover:bg-gray-300"
                    onClick={() => abrirModal(usuario, "ver")}
                  >
                    <FaEye />
                  </button>
                  <button
                    className="p-2 bg-gray-200 rounded-md hover:bg-gray-300"
                    onClick={() => abrirModal(usuario, "editar")}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    onClick={() => eliminarUsuario(usuario.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {usuarios.length === 0 && (
            <tr>
              <td colSpan={4} className="p-2 text-gray-500 text-center">
                No hay usuarios registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      {usuarioSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg shadow-lg w-[90%] max-w-md">
            <h3 className="text-lg font-bold mb-3">
              {modalTipo === "ver" ? "Detalles del Usuario" : "Editar Usuario"}
            </h3>
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-1">Nombre</label>
              <input
                type="text"
                value={usuarioSeleccionado.nombre}
                onChange={(e) =>
                  setUsuarioSeleccionado({ ...usuarioSeleccionado, nombre: e.target.value })
                }
                className="p-2 border border-gray-300 rounded-md w-full"
                disabled={modalTipo === "ver"}
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input
                type="email"
                value={usuarioSeleccionado.email}
                onChange={(e) =>
                  setUsuarioSeleccionado({ ...usuarioSeleccionado, email: e.target.value })
                }
                className="p-2 border border-gray-300 rounded-md w-full"
                disabled={modalTipo === "ver"}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={cerrarModal}
                className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cerrar
              </button>
              {modalTipo === "editar" && (
                <button
                  onClick={guardarCambios}
                  className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Guardar Cambios
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionUsuarios;