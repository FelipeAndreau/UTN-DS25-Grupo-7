import { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { vehiculosService, Vehiculo } from "../../services/api";

const GestionVehiculos = () => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nuevoVehiculo, setNuevoVehiculo] = useState<Omit<Vehiculo, 'id' | 'creadoEn' | 'actualizadoEn'>>({
    marca: "",
    modelo: "",
    anio: new Date().getFullYear(),
    precio: 0,
    estado: "Disponible",
    imagen: "",
    descripcion: "",
  });

  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<Vehiculo | null>(null);
  const [modalTipo, setModalTipo] = useState("");

  // Cargar vehículos al montar el componente
  useEffect(() => {
    cargarVehiculos();
  }, []);

  const cargarVehiculos = async () => {
    try {
      setLoading(true);
      setError(null);
  const vehiculosData = await vehiculosService.getAllAdmin();
  setVehiculos(vehiculosData);
    } catch (error) {
      console.error('Error al cargar vehículos:', error);
      setError('Error al cargar los vehículos');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChangeEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && vehiculoSeleccionado) {
      const readers = Array.from(files).map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then(base64Images => {
        setVehiculoSeleccionado({
          ...vehiculoSeleccionado,
          imagen: JSON.stringify(base64Images)
        });
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files) as File[];
      const readers = fileArray.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then(base64Images => {
        setNuevoVehiculo({
          ...nuevoVehiculo,
          imagen: JSON.stringify(base64Images)
        });
      });
    }
  };

  const agregarVehiculo = async () => {
    if (
      nuevoVehiculo.marca &&
      nuevoVehiculo.modelo &&
      nuevoVehiculo.anio &&
      nuevoVehiculo.precio &&
      nuevoVehiculo.imagen &&
      nuevoVehiculo.descripcion
    ) {
      try {
        await vehiculosService.create(nuevoVehiculo);
        setNuevoVehiculo({
          marca: "",
          modelo: "",
          anio: new Date().getFullYear(),
          precio: 0,
          estado: "Disponible",
          imagen: "",
          descripcion: "",
        });
        await cargarVehiculos(); // Recargar la lista
        alert("Vehículo agregado exitosamente");
      } catch (error) {
        console.error('Error al agregar vehículo:', error);
        alert("Error al agregar el vehículo");
      }
    } else {
      alert("Por favor, completa todos los campos antes de agregar un vehículo.");
    }
  };

  const eliminarVehiculo = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este vehículo?")) {
      try {
        await vehiculosService.delete(id);
        await cargarVehiculos(); // Recargar la lista
        alert("Vehículo eliminado exitosamente");
      } catch (error) {
        console.error('Error al eliminar vehículo:', error);
        alert("Error al eliminar el vehículo");
      }
    }
  };

  const abrirModal = (vehiculo: Vehiculo, tipo: string) => {
    setVehiculoSeleccionado(vehiculo);
    setModalTipo(tipo);
  };

  const cerrarModal = () => {
    setVehiculoSeleccionado(null);
    setModalTipo("");
  };

  const guardarCambios = async () => {
    if (!vehiculoSeleccionado || !vehiculoSeleccionado.id) {
      console.error("No hay un vehículo seleccionado o el vehículo no tiene un ID válido.");
      return;
    }

    try {
      await vehiculosService.update(vehiculoSeleccionado.id, vehiculoSeleccionado);
      await cargarVehiculos(); // Recargar la lista
      cerrarModal();
      alert("Vehículo actualizado exitosamente");
    } catch (error) {
      console.error('Error al actualizar vehículo:', error);
      alert("Error al actualizar el vehículo");
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full p-5 bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: "url('/GestionVehiculoBK.png')" }}>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <p className="text-lg">Cargando vehículos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full p-5 bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: "url('/GestionVehiculoBK.png')" }}>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <p className="text-lg text-red-600">{error}</p>
          <button
            onClick={cargarVehiculos}
            className="mt-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className="w-full h-full p-5 bg-cover bg-center"
      style={{ backgroundImage: "url('/GestionVehiculoBK.png')" }}
    >
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-5">Gestión de Vehículos</h2>

        {/* Formulario para agregar vehículo */}
        <div className="mb-5">
          <h3 className="text-lg font-semibold mb-3">Agregar Nuevo Vehículo</h3>
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Marca"
              value={nuevoVehiculo.marca}
              onChange={(e) =>
                setNuevoVehiculo({ ...nuevoVehiculo, marca: e.target.value })
              }
              className="p-2 border border-gray-300 rounded-md flex-1"
            />
            <input
              type="text"
              placeholder="Modelo"
              value={nuevoVehiculo.modelo}
              onChange={(e) =>
                setNuevoVehiculo({ ...nuevoVehiculo, modelo: e.target.value })
              }
              className="p-2 border border-gray-300 rounded-md flex-1"
            />
            <input
              type="text"
              inputMode="numeric"
              placeholder="Año"
              value={nuevoVehiculo.anio}
              onChange={(e) =>
                setNuevoVehiculo({ ...nuevoVehiculo, anio: parseInt(e.target.value) || new Date().getFullYear() })
              }
              className="p-2 border border-gray-300 rounded-md flex-1"
            />
            <input
              type="text"
              inputMode="numeric"
              placeholder="Precio"
              value={nuevoVehiculo.precio}
              onChange={(e) =>
                setNuevoVehiculo({ ...nuevoVehiculo, precio: parseFloat(e.target.value) || 0 })
              }
              className="p-2 border border-gray-300 rounded-md flex-1"
            />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="p-2 border border-gray-300 rounded-md flex-1"
            />
            <textarea
              placeholder="Descripción"
              value={nuevoVehiculo.descripcion}
              onChange={(e) =>
                setNuevoVehiculo({ ...nuevoVehiculo, descripcion: e.target.value })
              }
              className="p-2 border border-gray-300 rounded-md flex-1"
            />
            <select
              value={nuevoVehiculo.estado}
              onChange={(e) =>
                setNuevoVehiculo({ ...nuevoVehiculo, estado: e.target.value as 'Disponible' | 'Reservado' | 'Vendido' })
              }
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="Disponible">Disponible</option>
              <option value="Reservado">Reservado</option>
              <option value="Vendido">Vendido</option>
            </select>
            <button
              onClick={agregarVehiculo}
              className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Agregar Vehículo
            </button>
          </div>
        </div>

        {/* Tabla de vehículos */}
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Imagen</th>
              <th className="border border-gray-300 p-2">Marca</th>
              <th className="border border-gray-300 p-2">Modelo</th>
              <th className="border border-gray-300 p-2">Año</th>
              <th className="border border-gray-300 p-2">Precio</th>
              <th className="border border-gray-300 p-2">Estado</th>
              <th className="border border-gray-300 p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vehiculos.map((vehiculo) => (
              <tr key={vehiculo.id} className="text-center">
                <td className="border border-gray-300 p-2">
                  <img
                    src={(() => {
                      try {
                        const imgs = JSON.parse(vehiculo.imagen);
                        return Array.isArray(imgs) ? imgs[0] : vehiculo.imagen;
                      } catch {
                        return vehiculo.imagen;
                      }
                    })()}
                    alt={vehiculo.modelo}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </td>
                <td className="border border-gray-300 p-2">{vehiculo.marca}</td>
                <td className="border border-gray-300 p-2">{vehiculo.modelo}</td>
                <td className="border border-gray-300 p-2">{vehiculo.anio}</td>
                <td className="border border-gray-300 p-2">${vehiculo.precio}</td>
                <td className="border border-gray-300 p-2">
                  <span
                    className={`px-2 py-1 rounded-full text-white text-sm ${
                      vehiculo.estado === "Disponible"
                        ? "bg-green-500"
                        : vehiculo.estado === "Reservado"
                        ? "bg-yellow-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {vehiculo.estado}
                  </span>
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      className="p-2 bg-gray-200 rounded-md hover:bg-gray-300"
                      onClick={() => abrirModal(vehiculo, "ver")}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="p-2 bg-gray-200 rounded-md hover:bg-gray-300"
                      onClick={() => abrirModal(vehiculo, "editar")}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      onClick={() => vehiculo.id && eliminarVehiculo(vehiculo.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {vehiculoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg shadow-lg w-[90%] max-w-md">
            <h3 className="text-lg font-bold mb-3">
              {modalTipo === "ver" ? "Detalles del Vehículo" : "Editar Vehículo"}
            </h3>
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-1">Marca</label>
              <input
                type="text"
                value={vehiculoSeleccionado.marca}
                onChange={(e) =>
                  setVehiculoSeleccionado({
                    ...(vehiculoSeleccionado || {}),
                    marca: e.target.value,
                  })
                }
                className="p-2 border border-gray-300 rounded-md w-full"
                disabled={modalTipo === "ver"}
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-1">Modelo</label>
              <input
                type="text"
                value={vehiculoSeleccionado.modelo}
                onChange={(e) =>
                  setVehiculoSeleccionado({
                    ...vehiculoSeleccionado,
                    modelo: e.target.value,
                  })
                }
                className="p-2 border border-gray-300 rounded-md w-full"
                disabled={modalTipo === "ver"}
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-1">Año</label>
              <input
                type="number"
                value={vehiculoSeleccionado.anio}
                onChange={(e) =>
                  setVehiculoSeleccionado({
                    ...vehiculoSeleccionado,
                    anio: Number(e.target.value),
                  })
                }
                className="p-2 border border-gray-300 rounded-md w-full"
                disabled={modalTipo === "ver"}
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-1">Precio</label>
              <input
                type="number"
                value={vehiculoSeleccionado.precio}
                onChange={(e) =>
                  setVehiculoSeleccionado({
                    ...vehiculoSeleccionado,
                    precio: Number(e.target.value),
                  })
                }
                className="p-2 border border-gray-300 rounded-md w-full"
                disabled={modalTipo === "ver"}
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-1">Imagen</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChangeEdit}
                className="p-2 border border-gray-300 rounded-md w-full"
                disabled={modalTipo === "ver"}
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-1">Descripción</label>
              <textarea
                value={vehiculoSeleccionado.descripcion}
                onChange={(e) =>
                  setVehiculoSeleccionado({
                    ...vehiculoSeleccionado,
                    descripcion: e.target.value,
                  })
                }
                className="p-2 border border-gray-300 rounded-md w-full"
                disabled={modalTipo === "ver"}
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-1">Estado</label>
              <select
                value={vehiculoSeleccionado.estado}
                onChange={(e) =>
                  setVehiculoSeleccionado({
                    ...vehiculoSeleccionado,
                    estado: e.target.value as 'Disponible' | 'Reservado' | 'Vendido',
                  })
                }
                className="p-2 border border-gray-300 rounded-md w-full"
                disabled={modalTipo === "ver"}
              >
                <option value="Disponible">Disponible</option>
                <option value="Reservado">Reservado</option>
                <option value="Vendido">Vendido</option>
              </select>
            </div>
            {modalTipo === "editar" && (
              <button
                onClick={guardarCambios}
                className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full"
              >
                Guardar Cambios
              </button>
            )}
            <button
              onClick={cerrarModal}
              className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 w-full mt-3"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionVehiculos;