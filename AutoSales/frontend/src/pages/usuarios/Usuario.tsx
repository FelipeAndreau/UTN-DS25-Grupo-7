import { useState } from "react";
import Slider from "react-slick";
import { FaHome, FaCar, FaUser, FaCog, FaCalendarAlt, FaWhatsapp } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Usuario = () => {
  const [seccionActiva, setSeccionActiva] = useState("inicio");
  const [filtroMarca, setFiltroMarca] = useState("");
  const [filtroModelo, setFiltroModelo] = useState("");
  const [fechaVisita, setFechaVisita] = useState("");
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<string | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuario, setUsuario] = useState({
    nombre: "Juan Pérez",
    email: "juan.perez@email.com",
    password: "123456",
  });

  const [vehiculos, setVehiculos] = useState([
    {
      id: "VH-1001",
      marca: "Honda",
      modelo: "Civic",
      estado: "Disponible",
      imagen: "/images/fotosautos/hondacivic.png",
      descripcion: "Un sedán confiable y eficiente, ideal para la ciudad.",
    },
    {
      id: "VH-1002",
      marca: "Honda",
      modelo: "CR-V",
      estado: "Reservado",
      imagen: "/images/fotosautos/hondacrv.png",
      descripcion: "SUV espacioso y cómodo, perfecto para viajes largos.",
    },
    {
      id: "VH-1003",
      marca: "Ferrari",
      modelo: "Ferrari",
      estado: "Vendido",
      imagen: "/images/fotosautos/ferrari.png",
      descripcion: "SUV robusto con capacidad todoterreno.",
    },
  ]);

  const [reservas, setReservas] = useState([
    { id: "RS-2001", vehiculo: "Toyota Corolla", fecha: "2025-05-01", estado: "Activa" },
  ]);

  const [vehiculosPopulares] = useState([
    {
      id: "VH-1001",
      marca: "Honda",
      modelo: "Civic",
      imagen: "/images/fotosautos/hondacivic.png",
      descripcion: "Un sedán confiable y eficiente, ideal para la ciudad.",
    },
    {
      id: "VH-1002",
      marca: "Honda",
      modelo: "CR-V",
      imagen: "/images/fotosautos/hondacrv.png",
      descripcion: "SUV espacioso y cómodo, perfecto para viajes largos.",
    },
  ]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const handleReservar = (vehiculoId: string) => {
    setVehiculoSeleccionado(vehiculoId);
    setModalAbierto(true);
  };

  const confirmarReserva = () => {
    if (!vehiculoSeleccionado || !fechaVisita) {
      alert("Por favor selecciona una fecha para la visita.");
      return;
    }

    const vehiculo = vehiculos.find((v) => v.id === vehiculoSeleccionado);
    if (vehiculo && vehiculo.estado === "Disponible") {
      setReservas((prevReservas) => [
        ...prevReservas,
        {
          id: `RS-${Math.floor(Math.random() * 10000)}`,
          vehiculo: `${vehiculo.marca} ${vehiculo.modelo}`,
          fecha: fechaVisita,
          estado: "Activa",
        },
      ]);

      setVehiculos((prevVehiculos) =>
        prevVehiculos.map((v) =>
          v.id === vehiculoSeleccionado ? { ...v, estado: "Reservado" } : v
        )
      );

      // Crear mensaje para WhatsApp
      const mensaje = `Hola! Me gustaría agendar una visita al concesionario para ver el vehículo ${vehiculo.marca} ${vehiculo.modelo} el día ${fechaVisita}. ¿Podrían confirmarme la disponibilidad?`;
      const numeroWhatsApp = "5492216335590"; // Número del concesionario
      const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
      
      alert("Reserva realizada con éxito. Se abrirá WhatsApp para confirmar tu visita.");
      
      // Abrir WhatsApp después del alert
      setTimeout(() => {
        window.open(urlWhatsApp, '_blank');
      }, 500);
      
      // Limpiar estado
      setVehiculoSeleccionado(null);
      setFechaVisita("");
      setModalAbierto(false);
    } else {
      alert("Este vehículo no está disponible para reservar.");
    }
  };

  const enviarWhatsAppReserva = (reserva: any) => {
    const mensaje = `Hola! Tengo una reserva confirmada para visitar el concesionario el día ${reserva.fecha} y ver el vehículo ${reserva.vehiculo}. ¿Podrían confirmarme los detalles de la visita?`;
    const numeroWhatsApp = "5492216335590"; // Número del concesionario
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    
    window.open(urlWhatsApp, '_blank');
  };

  const handleCancelarReserva = (reservaId: string) => {
    const reserva = reservas.find((r) => r.id === reservaId);
    if (reserva) {
      setVehiculos((prevVehiculos) =>
        prevVehiculos.map((vehiculo) =>
          vehiculo.marca + " " + vehiculo.modelo === reserva.vehiculo
            ? { ...vehiculo, estado: "Disponible" }
            : vehiculo
        )
      );

      setReservas((prevReservas) => prevReservas.filter((r) => r.id !== reservaId));
      alert("Reserva cancelada con éxito.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const guardarCambios = () => {
    alert("Cambios guardados correctamente.");
  };
  
  const vehiculosFiltrados = vehiculos.filter((vehiculo) => {
    const coincideMarca =
      filtroMarca === "" || vehiculo.marca.toLowerCase().includes(filtroMarca.toLowerCase());
    const coincideModelo =
      filtroModelo === "" || vehiculo.modelo.toLowerCase().includes(filtroModelo.toLowerCase());
    return coincideMarca && coincideModelo;
  });

  return (
    <div className="flex h-screen">
      {/* Menu lateral */}
      <div className="w-1/5 bg-gray-900 text-white p-5">
        <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
          <FaUser /> Usuario
        </h2>
        <ul className="space-y-4">
          <li
            className={`p-3 rounded-lg flex items-center gap-2 cursor-pointer transition-all duration-300 ${
              seccionActiva === "inicio" ? "bg-blue-500" : "bg-gray-800 hover:bg-gray-700"
            }`}
            onClick={() => setSeccionActiva("inicio")}
          >
            <FaHome /> Inicio
          </li>
          <li
            className={`p-3 rounded-lg flex items-center gap-2 cursor-pointer transition-all duration-300 ${
              seccionActiva === "vehiculos" ? "bg-blue-500" : "bg-gray-800 hover:bg-gray-700"
            }`}
            onClick={() => setSeccionActiva("vehiculos")}
          >
            <FaCar /> Vehículos
          </li>
          <li
            className={`p-3 rounded-lg flex items-center gap-2 cursor-pointer transition-all duration-300 ${
              seccionActiva === "reservas" ? "bg-blue-500" : "bg-gray-800 hover:bg-gray-700"
            }`}
            onClick={() => setSeccionActiva("reservas")}
          >
            <FaCalendarAlt /> Mis Reservas
          </li>
          <li
            className={`p-3 rounded-lg flex items-center gap-2 cursor-pointer transition-all duration-300 ${
              seccionActiva === "cuenta" ? "bg-blue-500" : "bg-gray-800 hover:bg-gray-700"
            }`}
            onClick={() => setSeccionActiva("cuenta")}
          >
            <FaCog /> Mi Cuenta
          </li>
        </ul>
      </div>

      {/* Contenido principal */}
      <div className="w-4/5 p-5 bg-gray-100">
        {seccionActiva === "inicio" && (
          <>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Bienvenido, Usuario</h1>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Vehículos Populares</h2>
              <Slider {...sliderSettings}>
                {vehiculosPopulares.map((vehiculo) => (
                  <div key={vehiculo.id} className="p-4">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <img
                        src={vehiculo.imagen}
                        alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-bold">
                          {vehiculo.marca} {vehiculo.modelo}
                        </h3>
                        <p className="text-sm text-gray-500">{vehiculo.descripcion}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </>
        )}

        {seccionActiva === "vehiculos" && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaCar /> Vehículos Disponibles
            </h2>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Buscar por MARCA..."
                value={filtroMarca}
                onChange={(e) => setFiltroMarca(e.target.value)}
                className="p-2 border border-gray-300 rounded-md w-full md:w-1/2"
              />
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Buscar por MODELO..."
                value={filtroModelo}
                onChange={(e) => setFiltroModelo(e.target.value)}
                className="p-2 border border-gray-300 rounded-md w-full md:w-1/2"
              />
            </div>

            {vehiculosFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vehiculosFiltrados.map((vehiculo) => (
                  <div
                    key={vehiculo.id}
                    className="p-4 bg-white rounded-lg shadow-md flex flex-col items-start"
                  >
                    <img
                      src={vehiculo.imagen}
                      alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                      className="w-full h-40 object-cover rounded-md mb-3"
                    />
                    <h3 className="text-lg font-bold">
                      {vehiculo.marca} {vehiculo.modelo}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{vehiculo.descripcion}</p>
                    <p className="text-sm text-gray-500">Estado: {vehiculo.estado}</p>
                    {vehiculo.estado === "Disponible" && (
                      <button
                        onClick={() => handleReservar(vehiculo.id)}
                        className="mt-3 w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Reservar
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No se encontraron vehículos con esa marca o modelo.</p>
            )}
          </div>
        )}

        {seccionActiva === "reservas" && (
          <div id="reservas">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaCalendarAlt /> Mis Reservas
            </h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">Vehículo</th>
                  <th className="border border-gray-300 p-2">Fecha</th>
                  <th className="border border-gray-300 p-2">Estado</th>
                  <th className="border border-gray-300 p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((reserva) => (
                  <tr key={reserva.id} className="text-center">
                    <td className="border border-gray-300 p-2">{reserva.vehiculo}</td>
                    <td className="border border-gray-300 p-2">{reserva.fecha}</td>
                    <td className="border border-gray-300 p-2">
                      <span
                        className={`px-2 py-1 rounded-full text-white text-sm ${
                          reserva.estado === "Activa" ? "bg-green-500" : "bg-gray-500"
                        }`}
                      >
                        {reserva.estado}
                      </span>
                    </td>
                    <td className="border border-gray-300 p-2">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => enviarWhatsAppReserva(reserva)}
                          className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-1"
                          title="Contactar por WhatsApp"
                        >
                          <FaWhatsapp size={14} />
                        </button>
                        <button
                          onClick={() => handleCancelarReserva(reserva.id)}
                          className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                          Cancelar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {seccionActiva === "cuenta" && (
          <div>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Mi Cuenta</h1>
            <form className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={usuario.nombre}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={usuario.email}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={usuario.password}
                  onChange={handleInputChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <button
                type="button"
                onClick={guardarCambios}
                className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Guardar Cambios
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Modal de reserva personalizado */}
      {modalAbierto && vehiculoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-xl overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">Reservar vehículo</h3>
              <button
                onClick={cerrarModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              {(() => {
                const vehiculo = vehiculos.find(v => v.id === vehiculoSeleccionado);
                return vehiculo ? (
                  <>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm font-medium text-gray-600 mb-1">Vehículo a reservar</p>
                      <p className="text-gray-800 font-semibold">{vehiculo.marca} {vehiculo.modelo}</p>
                      <p className="text-sm text-green-600 font-medium mt-1">Estado: {vehiculo.estado}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2 text-sm text-gray-600 bg-blue-50 border border-blue-200 p-3 rounded">
                        ✅ Se utilizarán automáticamente los datos del usuario autenticado.
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de visita</label>
                        <input
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          value={fechaVisita}
                          onChange={(e) => setFechaVisita(e.target.value)}
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Selecciona el día en que deseas visitar el concesionario.</p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <button
                        onClick={cerrarModal}
                        className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={confirmarReserva}
                        disabled={!fechaVisita}
                        className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <FaWhatsapp />
                        Confirmar por WhatsApp
                      </button>
                    </div>
                  </>
                ) : null;
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuario;
