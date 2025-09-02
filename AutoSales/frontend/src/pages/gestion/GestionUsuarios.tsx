import { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { usuariosService, Usuario } from "../../services/api";

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nuevoUsuario, setNuevoUsuario] = useState<Omit<Usuario, 'id' | 'creadoEn' | 'actualizadoEn'>>({
    nombre: "",
    email: "",
    password: "",
    rol: "viewer",
    activo: true
  });
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);
  const [modalTipo, setModalTipo] = useState(""); // "ver" o "editar"

  // Cargar usuarios al montar el componente
  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const usuariosData = await usuariosService.getAll();
      setUsuarios(usuariosData);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setError('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const agregarUsuario = async () => {
    if (nuevoUsuario.nombre && nuevoUsuario.email && nuevoUsuario.password) {
      try {
        await usuariosService.create(nuevoUsuario);
        setNuevoUsuario({
          nombre: "",
          email: "",
          password: "",
          rol: "viewer",
          activo: true
        });
        await cargarUsuarios(); // Recargar la lista
        alert("Usuario agregado exitosamente");
      } catch (error) {
        console.error('Error al agregar usuario:', error);
        alert("Error al agregar el usuario");
      }
    } else {
      alert("Por favor, completa todos los campos.");
    }
  };

  const eliminarUsuario = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        await usuariosService.delete(id);
        await cargarUsuarios(); // Recargar la lista
        alert("Usuario eliminado exitosamente");
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alert("Error al eliminar el usuario");
      }
    }
  };

  const abrirModal = (usuario: Usuario, tipo: string) => {
    setUsuarioSeleccionado(usuario);
    setModalTipo(tipo);
  };

  const cerrarModal = () => {
    setUsuarioSeleccionado(null);
    setModalTipo("");
  };

  const guardarCambios = async () => {
    if (!usuarioSeleccionado || !usuarioSeleccionado.id) {
      console.error("No hay un usuario seleccionado o el usuario no tiene un ID válido.");
      return;
    }

    try {
      await usuariosService.update(usuarioSeleccionado.id, usuarioSeleccionado);
      await cargarUsuarios(); // Recargar la lista
      cerrarModal();
      alert("Usuario actualizado exitosamente");
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      alert("Error al actualizar el usuario");
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full p-5 bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: "url('/GestionUsuariosBK.png')" }}>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <p className="text-lg">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full p-5 bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: "url('/GestionUsuariosBK.png')" }}>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <p className="text-lg text-red-600">{error}</p>
          <button
            onClick={cargarUsuarios}
            className="mt-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-5">Gestión de Usuarios</h2>

      {/* Formulario para agregar usuario */}
      <div className="mb-5">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Nombre"
            value={nuevoUsuario.nombre}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
            className="p-2 border border-gray-300 rounded-md flex-1"
          />
          <input
            type="email"
            placeholder="Email"
            value={nuevoUsuario.email}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })}
            className="p-2 border border-gray-300 rounded-md flex-1"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={nuevoUsuario.password}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })}
            className="p-2 border border-gray-300 rounded-md flex-1"
          />
          <select
            value={nuevoUsuario.rol}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value as 'admin' | 'viewer' })}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
          <button
            onClick={agregarUsuario}
            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Agregar Usuario
          </button>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Nombre</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Rol</th>
            <th className="border border-gray-300 p-2">Estado</th>
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
                <span className={`px-2 py-1 rounded-full text-white text-sm ${usuario.rol === 'admin' ? 'bg-red-500' : 'bg-blue-500'}`}>
                  {usuario.rol}
                </span>
              </td>
              <td className="border border-gray-300 p-2">
                <span className={`px-2 py-1 rounded-full text-white text-sm ${usuario.activo ? 'bg-green-500' : 'bg-gray-500'}`}>
                  {usuario.activo ? 'Activo' : 'Inactivo'}
                </span>
              </td>
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
                    onClick={() => usuario.id && eliminarUsuario(usuario.id)}
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
