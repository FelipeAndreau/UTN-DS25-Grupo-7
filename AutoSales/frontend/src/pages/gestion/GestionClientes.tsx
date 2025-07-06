import { useState } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const GestionClientes = () => {
  const [clientes, setClientes] = useState([
    {
      id: "CL-2345",
      nombre: "Ana Martínez",
      email: "ana.martinez@email.com",
      telefono: "+52 555 123 4567",
      tipo: "Particular",
      estado: "Activo",
      actividad: "15/10/2023 - Compra",
    },
    {
      id: "CL-2346",
      nombre: "Roberto López",
      email: "roberto.lopez@email.com",
      telefono: "+52 555 987 6543",
      tipo: "Particular",
      estado: "Activo",
      actividad: "14/10/2023 - Compra",
    },
    {
      id: "CL-2347",
      nombre: "María González",
      email: "maria.gonzalez@email.com",
      telefono: "+52 555 456 7890",
      tipo: "Particular",
      estado: "En proceso",
      actividad: "12/10/2023 - Prueba de manejo",
    },
    {
      id: "CL-2348",
      nombre: "Juan Rodríguez",
      email: "juan.rodriguez@email.com",
      telefono: "+52 555 234 5678",
      tipo: "Empresa",
      estado: "Financiamiento",
      actividad: "10/10/2023 - Solicitud de crédito",
    },
    {
      id: "CL-2349",
      nombre: "Laura Vega",
      email: "laura.vega@email.com",
      telefono: "+52 555 876 5432",
      tipo: "Particular",
      estado: "Potencial",
      actividad: "08/10/2023 - Consulta",
    },
  ]);

  const [filtro, setFiltro] = useState({
    texto: "",
    estado: "Todos",
    tipo: "Todos",
  });

  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    email: "",
    telefono: "",
    tipo: "Particular",
    estado: "Activo",
    actividad: "", // <-- Agregar campo actividad
  });

  const [clienteSeleccionado, setClienteSeleccionado] = useState<{
    id: string;
    nombre: string;
    email: string;
    telefono: string;
    tipo: string;
    estado: string;
    actividad?: string;
  } | null>(null);
  const [modalTipo, setModalTipo] = useState(""); // "ver" o "editar"

  const agregarCliente = () => {
    if (
      nuevoCliente.nombre &&
      nuevoCliente.email &&
      nuevoCliente.telefono &&
      nuevoCliente.actividad // <-- Validar actividad
    ) {
      setClientes((prevClientes) => [
        ...prevClientes,
        {
          id: `CL-${Math.floor(Math.random() * 10000)}`,
          ...nuevoCliente,
        },
      ]);
      setNuevoCliente({
        nombre: "",
        email: "",
        telefono: "",
        tipo: "Particular",
        estado: "Activo",
        actividad: "", // <-- Limpiar actividad
      });
    } else {
      alert("Por favor, completa todos los campos antes de agregar un cliente.");
    }
  };

  const eliminarCliente = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      setClientes(prev => prev.filter(c => c.id !== id));
      alert("Cliente eliminado localmente");
    }
  };

  const filtrarClientes = () => {
    return clientes.filter((cliente) => {
      const coincideTexto =
        cliente.nombre.toLowerCase().includes(filtro.texto.toLowerCase()) ||
        cliente.email.toLowerCase().includes(filtro.texto.toLowerCase()) ||
        cliente.telefono.includes(filtro.texto);
      const coincideEstado =
        filtro.estado === "Todos" || cliente.estado === filtro.estado;
      const coincideTipo =
        filtro.tipo === "Todos" || cliente.tipo === filtro.tipo;

      return coincideTexto && coincideEstado && coincideTipo;
    });
  };

  const abrirModal = (cliente: { id: string; nombre: string; email: string; telefono: string; tipo: string; estado: string; actividad?: string }, tipo: string) => {
    setClienteSeleccionado(cliente);
    setModalTipo(tipo);
  };

  const cerrarModal = () => {
    setClienteSeleccionado(null);
    setModalTipo("");
  };

  const guardarCambios = () => {
    if (!clienteSeleccionado || !clienteSeleccionado.id) {
      console.error("No hay un cliente seleccionado o el cliente no tiene un ID válido.");
      return;
    }

    setClientes((prevClientes) =>
      prevClientes.map((cliente) =>
        cliente.id === clienteSeleccionado.id
          ? { ...clienteSeleccionado, actividad: clienteSeleccionado.actividad || "" }
          : cliente
      )
    );
    cerrarModal();
  };

  return (
    <div
      className="w-full h-full p-5 bg-cover bg-center"
      style={{ backgroundImage: "url('/GestionClienteBK.png')" }}
    >
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-5">Gestión de Clientes</h2>

        {/* Barra de búsqueda y filtros */}
        <div className="flex flex-wrap items-center gap-4 mb-5">
          <input
            type="text"
            placeholder="Nombre, email, teléfono..."
            className="flex-1 p-2 border border-gray-300 rounded-md"
            value={filtro.texto}
            onChange={(e) => setFiltro({ ...filtro, texto: e.target.value })}
          />
          <select
            className="p-2 border border-gray-300 rounded-md"
            value={filtro.estado}
            onChange={(e) => setFiltro({ ...filtro, estado: e.target.value })}
          >
            <option value="Todos">Estado</option>
            <option value="Activo">Activo</option>
            <option value="En proceso">En proceso</option>
            <option value="Financiamiento">Financiamiento</option>
            <option value="Potencial">Potencial</option>
          </select>
          <select
            className="p-2 border border-gray-300 rounded-md"
            value={filtro.tipo}
            onChange={(e) => setFiltro({ ...filtro, tipo: e.target.value })}
          >
            <option value="Todos">Tipo</option>
            <option value="Particular">Particular</option>
            <option value="Empresa">Empresa</option>
          </select>
          <button
            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={filtrarClientes}
          >
            Filtrar
          </button>
        </div>

        {/* Formulario para agregar cliente */}
        <div className="mb-5">
          <h3 className="text-lg font-semibold mb-3">Agregar Nuevo Cliente</h3>
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Nombre"
              value={nuevoCliente.nombre}
              onChange={(e) =>
                setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })
              }
              className="p-2 border border-gray-300 rounded-md flex-1"
            />
            <input
              type="email"
              placeholder="Email"
              value={nuevoCliente.email}
              onChange={(e) =>
                setNuevoCliente({ ...nuevoCliente, email: e.target.value })
              }
              className="p-2 border border-gray-300 rounded-md flex-1"
            />
            <input
              type="text"
              placeholder="Teléfono"
              value={nuevoCliente.telefono}
              onChange={(e) =>
                setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })
              }
              className="p-2 border border-gray-300 rounded-md flex-1"
            />
            <input
              type="text"
              placeholder="Observación / Actividad"
              value={nuevoCliente.actividad}
              onChange={(e) =>
                setNuevoCliente({ ...nuevoCliente, actividad: e.target.value })
              }
              className="p-2 border border-gray-300 rounded-md flex-1"
            />
            <select
              value={nuevoCliente.tipo}
              onChange={(e) =>
                setNuevoCliente({ ...nuevoCliente, tipo: e.target.value })
              }
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="Particular">Particular</option>
              <option value="Empresa">Empresa</option>
            </select>
            <select
              value={nuevoCliente.estado}
              onChange={(e) =>
                setNuevoCliente({ ...nuevoCliente, estado: e.target.value })
              }
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="Activo">Activo</option>
              <option value="En proceso">En proceso</option>
              <option value="Financiamiento">Financiamiento</option>
              <option value="Potencial">Potencial</option>
            </select>
            <button
              onClick={agregarCliente}
              className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Agregar Cliente
            </button>
          </div>
        </div>

        {/* Tabla de clientes */}
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Cliente</th>
              <th className="border border-gray-300 p-2">Contacto</th>
              <th className="border border-gray-300 p-2">Tipo</th>
              <th className="border border-gray-300 p-2">Estado</th>
              <th className="border border-gray-300 p-2">Última Actividad</th>
              <th className="border border-gray-300 p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrarClientes().map((cliente) => (
              <tr key={cliente.id} className="text-center">
                <td className="border border-gray-300 p-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
                      {cliente.nombre.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-bold">{cliente.nombre}</p>
                      <p className="text-sm text-gray-500">ID: {cliente.id}</p>
                    </div>
                  </div>
                </td>
                <td className="border border-gray-300 p-2">
                  <p>{cliente.email}</p>
                  <p className="text-sm text-gray-500">{cliente.telefono}</p>
                </td>
                <td className="border border-gray-300 p-2">{cliente.tipo}</td>
                <td className="border border-gray-300 p-2">
                  <span
                    className={`px-2 py-1 rounded-full text-white text-sm ${
                      cliente.estado === "Activo"
                        ? "bg-green-500"
                        : cliente.estado === "En proceso"
                        ? "bg-yellow-500"
                        : cliente.estado === "Financiamiento"
                        ? "bg-blue-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {cliente.estado}
                  </span>
                </td>
                <td className="border border-gray-300 p-2">{cliente.actividad}</td>
                <td className="border border-gray-300 p-2">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      className="p-2 bg-gray-200 rounded-md hover:bg-gray-300"
                      onClick={() => abrirModal(cliente, "ver")}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="p-2 bg-gray-200 rounded-md hover:bg-gray-300"
                      onClick={() => abrirModal(cliente, "editar")}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      onClick={() => eliminarCliente(cliente.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtrarClientes().length === 0 && (
                <tr>
                  <td colSpan={6} className="p-2 text-gray-500 text-center">
                    No hay clientes registrados.
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {clienteSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg shadow-lg w-[90%] max-w-md">
            <h3 className="text-lg font-bold mb-3">
              {modalTipo === "ver" ? "Detalles del Cliente" : "Editar Cliente"}
            </h3>
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-1">Nombre</label>
              <input
                type="text"
                value={clienteSeleccionado.nombre}
                onChange={(e) =>
                  setClienteSeleccionado({
                    ...clienteSeleccionado,
                    nombre: e.target.value,
                  })
                }
                className="p-2 border border-gray-300 rounded-md w-full"
                disabled={modalTipo === "ver"}
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input
                type="email"
                value={clienteSeleccionado.email}
                onChange={(e) =>
                  setClienteSeleccionado({
                    ...clienteSeleccionado,
                    email: e.target.value,
                  })
                }
                className="p-2 border border-gray-300 rounded-md w-full"
                disabled={modalTipo === "ver"}
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-1">Teléfono</label>
              <input
                type="text"
                value={clienteSeleccionado.telefono}
                onChange={(e) =>
                  setClienteSeleccionado({
                    ...clienteSeleccionado,
                    telefono: e.target.value,
                  })
                }
                className="p-2 border border-gray-300 rounded-md w-full"
                disabled={modalTipo === "ver"}
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-1">Observación / Actividad</label>
              <input
                type="text"
                value={clienteSeleccionado.actividad}
                onChange={(e) =>
                  setClienteSeleccionado({
                    ...clienteSeleccionado,
                    actividad: e.target.value,
                  })
                }
                className="p-2 border border-gray-300 rounded-md w-full"
                disabled={modalTipo === "ver"}
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-1">Tipo</label>
              <select
                value={clienteSeleccionado.tipo}
                onChange={(e) =>
                  setClienteSeleccionado({
                    ...clienteSeleccionado,
                    tipo: e.target.value,
                  })
                }
                className="p-2 border border-gray-300 rounded-md w-full"
                disabled={modalTipo === "ver"}
              >
                <option value="Particular">Particular</option>
                <option value="Empresa">Empresa</option>
              </select>
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-1">Estado</label>
              <select
                value={clienteSeleccionado.estado}
                onChange={(e) =>
                  setClienteSeleccionado({
                    ...clienteSeleccionado,
                    estado: e.target.value,
                  })
                }
                className="p-2 border border-gray-300 rounded-md w-full"
                disabled={modalTipo === "ver"}
              >
                <option value="Activo">Activo</option>
                <option value="En proceso">En proceso</option>
                <option value="Financiamiento">Financiamiento</option>
                <option value="Potencial">Potencial</option>
              </select>
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

export default GestionClientes;
