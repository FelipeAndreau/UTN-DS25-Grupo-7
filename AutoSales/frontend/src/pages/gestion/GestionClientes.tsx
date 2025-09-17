import { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaCalendarAlt } from "react-icons/fa";
import { clientesService, Cliente, reservasService, Reserva } from "../../services/api";

const GestionClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filtro, setFiltro] = useState({
    texto: "",
    estado: "Todos",
    tipo: "Todos",
  });

  const [nuevoCliente, setNuevoCliente] = useState<Omit<Cliente, 'id' | 'creadoEn' | 'actualizadoEn'>>({
    nombre: "",
    email: "",
    telefono: "",
    tipo: "Particular",
    estado: "Activo",
    actividad: "",
  });

  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [modalTipo, setModalTipo] = useState(""); // "ver", "editar", o "reservas"

  // Estados para las reservas
  const [reservasCliente, setReservasCliente] = useState<Reserva[]>([]);
  const [loadingReservas, setLoadingReservas] = useState(false);

  // Cargar clientes al montar el componente
  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const clientesData = await clientesService.getAll();
      setClientes(clientesData);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      setError('Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  const agregarCliente = async () => {
    if (
      nuevoCliente.nombre &&
      nuevoCliente.email &&
      nuevoCliente.telefono &&
      nuevoCliente.actividad
    ) {
      try {
        await clientesService.create(nuevoCliente);
        setNuevoCliente({
          nombre: "",
          email: "",
          telefono: "",
          tipo: "Particular",
          estado: "Activo",
          actividad: "",
        });
        await cargarClientes(); // Recargar la lista
        alert("Cliente agregado exitosamente");
      } catch (error) {
        console.error('Error al agregar cliente:', error);
        alert("Error al agregar el cliente");
      }
    } else {
      alert("Por favor, completa todos los campos antes de agregar un cliente.");
    }
  };

  const eliminarCliente = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      try {
        await clientesService.delete(id);
        await cargarClientes(); // Recargar la lista
        alert("Cliente eliminado exitosamente");
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
        alert("Error al eliminar el cliente");
      }
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

  const abrirModal = (cliente: Cliente, tipo: string) => {
    setClienteSeleccionado(cliente);
    setModalTipo(tipo);
  };

  const cargarReservasCliente = async (clienteId: string) => {
    try {
      setLoadingReservas(true);
      const reservas = await reservasService.getByCliente(clienteId);
      setReservasCliente(reservas);
    } catch (error) {
      console.error('Error al cargar reservas del cliente:', error);
      setReservasCliente([]);
    } finally {
      setLoadingReservas(false);
    }
  };

  const abrirModalReservas = async (cliente: Cliente) => {
    setClienteSeleccionado(cliente);
    setModalTipo("reservas");
    if (cliente.id) {
      await cargarReservasCliente(cliente.id);
    }
  };

  const cerrarModal = () => {
    setClienteSeleccionado(null);
    setModalTipo("");
    setReservasCliente([]);
    setLoadingReservas(false);
  };

  const guardarCambios = async () => {
    if (!clienteSeleccionado || !clienteSeleccionado.id) {
      console.error("No hay un cliente seleccionado o el cliente no tiene un ID válido.");
      return;
    }

    try {
      await clientesService.update(clienteSeleccionado.id, clienteSeleccionado);
      await cargarClientes(); // Recargar la lista
      cerrarModal();
      alert("Cliente actualizado exitosamente");
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      alert("Error al actualizar el cliente");
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full p-5 bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: "url('/GestionClienteBK.png')" }}>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <p className="text-lg">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full p-5 bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: "url('/GestionClienteBK.png')" }}>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <p className="text-lg text-red-600">{error}</p>
          <button
            onClick={cargarClientes}
            className="mt-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

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
            <option value="En_proceso">En proceso</option>
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
                setNuevoCliente({ ...nuevoCliente, tipo: e.target.value as 'Particular' | 'Empresa' })
              }
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="Particular">Particular</option>
              <option value="Empresa">Empresa</option>
            </select>
            <select
              value={nuevoCliente.estado}
              onChange={(e) =>
                setNuevoCliente({ ...nuevoCliente, estado: e.target.value as 'Activo' | 'En_proceso' | 'Financiamiento' | 'Potencial' })
              }
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="Activo">Activo</option>
              <option value="En_proceso">En proceso</option>
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
                        : cliente.estado === "En_proceso"
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
                      title="Ver detalles"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      onClick={() => abrirModalReservas(cliente)}
                      title="Ver reservas"
                    >
                      <FaCalendarAlt />
                    </button>
                    <button
                      className="p-2 bg-gray-200 rounded-md hover:bg-gray-300"
                      onClick={() => abrirModal(cliente, "editar")}
                      title="Editar cliente"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      onClick={() => cliente.id && eliminarCliente(cliente.id)}
                      title="Eliminar cliente"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`bg-white p-5 rounded-lg shadow-lg ${modalTipo === "reservas" ? "w-[90%] max-w-4xl" : "w-[90%] max-w-md"} max-h-[90vh] overflow-y-auto`}>
            <h3 className="text-lg font-bold mb-3">
              {modalTipo === "ver" ? "Detalles del Cliente" : 
               modalTipo === "editar" ? "Editar Cliente" : 
               modalTipo === "reservas" ? `Reservas de ${clienteSeleccionado.nombre}` : "Cliente"}
            </h3>
            
            {modalTipo === "reservas" ? (
              // Contenido para mostrar reservas
              <div>
                {loadingReservas ? (
                  <div className="flex items-center justify-center py-8">
                    <p>Cargando reservas...</p>
                  </div>
                ) : reservasCliente.length > 0 ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Total de reservas: {reservasCliente.length}
                    </p>
                    {reservasCliente.map((reserva) => (
                      <div key={reserva.id} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-lg mb-2">Reserva #{reserva.id}</h4>
                            <p><strong>Estado:</strong> 
                              <span className={`ml-2 px-2 py-1 rounded text-white text-xs ${
                                reserva.estado === 'Confirmada' || reserva.estado === 'Activa' ? 'bg-green-500' :
                                reserva.estado === 'Pendiente' ? 'bg-yellow-500' :
                                reserva.estado === 'Cancelada' ? 'bg-red-500' :
                                'bg-gray-500'
                              }`}>
                                {reserva.estado}
                              </span>
                            </p>
                            {reserva.fecha && (
                              <p><strong>Fecha de reserva:</strong> {new Date(reserva.fecha).toLocaleDateString()}</p>
                            )}
                            {reserva.fechaVisita && (
                              <p><strong>Fecha de visita:</strong> {new Date(reserva.fechaVisita).toLocaleDateString()}</p>
                            )}
                          </div>
                          <div>
                            {reserva.vehiculo && (
                              <div>
                                <h5 className="font-semibold mb-1">Vehículo</h5>
                                <p><strong>Marca:</strong> {reserva.vehiculo.marca}</p>
                                <p><strong>Modelo:</strong> {reserva.vehiculo.modelo}</p>
                                <p><strong>Año:</strong> {reserva.vehiculo.anio}</p>
                                <p><strong>Precio:</strong> ${reserva.vehiculo.precio?.toLocaleString()}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        {reserva.notas && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p><strong>Notas:</strong> {reserva.notas}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Este cliente no tiene reservas registradas.</p>
                  </div>
                )}
                <div className="flex justify-end mt-6">
                  <button
                    onClick={cerrarModal}
                    className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            ) : (
              // Contenido original para ver/editar cliente
              <>
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
                        tipo: e.target.value as 'Particular' | 'Empresa',
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
                        estado: e.target.value as 'Activo' | 'En_proceso' | 'Financiamiento' | 'Potencial',
                      })
                    }
                    className="p-2 border border-gray-300 rounded-md w-full"
                    disabled={modalTipo === "ver"}
                  >
                    <option value="Activo">Activo</option>
                    <option value="En_proceso">En proceso</option>
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
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionClientes;
