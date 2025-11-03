import { useState, useEffect } from "react";
import { FaCar, FaUser, FaSignOutAlt, FaCalendarAlt, FaSearch, FaFilter, FaWhatsapp } from "react-icons/fa";
import { vehiculosService, reservasService, authService, type Reserva, type Vehiculo } from "../../services/api";
import { useToast } from "../../context/ToastContext";

const Catalogo = () => {
  const [seccionActiva, setSeccionActiva] = useState("catalogo");
  const [filtroMarca, setFiltroMarca] = useState("");
  const [filtroModelo, setFiltroModelo] = useState("");
  const [filtroPrecioMin, setFiltroPrecioMin] = useState("");
  const [filtroPrecioMax, setFiltroPrecioMax] = useState("");
  const [filtroAnio, setFiltroAnio] = useState("");
  const [busquedaGeneral, setBusquedaGeneral] = useState("");
  const [ordenarPor, setOrdenarPor] = useState("precio-asc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para datos reales de la API
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  // const [cliente, setCliente] = useState<Cliente | null>(null); // (opcional) si se usa en futuras mejoras
  
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalVehiculos, setTotalVehiculos] = useState(0);
  const [pageSize] = useState(12); // Mostrar 12 vehículos por página
  
  const [usuario, setUsuario] = useState({
    nombre: "",
    email: "",
  });

  // UI modal reserva
  const [showReservaModal, setShowReservaModal] = useState(false);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<Vehiculo | null>(null);
  const [reservaForm, setReservaForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    fechaVisita: ""
  });
  const hoy = new Date().toISOString().split("T")[0];

  // UI modal detalles
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [vehiculoDetalle, setVehiculoDetalle] = useState<Vehiculo | null>(null);

  // Toast notifications
  const { showToast } = useToast();

  // Función para obtener imágenes del vehículo
  const getVehiculoImagenes = (vehiculo: Vehiculo): string[] => {
    if (!vehiculo.imagen) return ["/images/fotosautos/default.png"];
    try {
      const parsed = JSON.parse(vehiculo.imagen);
      if (Array.isArray(parsed)) return parsed;
      return [vehiculo.imagen];
    } catch {
      return [vehiculo.imagen];
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      // Cargar vehículos disponibles con paginación (usando endpoint público)
      const vehiculosData = await vehiculosService.getAllPaginated(page, pageSize);
      setVehiculos(vehiculosData.data);
      setTotalVehiculos(vehiculosData.total);
      setTotalPages(vehiculosData.totalPages);
      setCurrentPage(page);

      // Obtener información del usuario autenticado
      const userInfo = authService.getUser();
      const isAuthenticated = authService.isAuthenticated();
      
      if (userInfo && isAuthenticated) {
        setUsuario({
          nombre: userInfo.nombre,
          email: userInfo.email || ""
        });

        try {
          // Para usuarios viewer, usar endpoint específico o público
          if (userInfo.rol !== 'admin') {
            console.log("Usuario viewer: no puede acceder a lista completa de clientes");
          } else {
            // Podríamos cargar clientes si fuera necesario más adelante
            // await clientesService.getAll();
          }
          
          // const clienteEncontrado = clientes.find(c => c.email === userInfo.email);
          // if (clienteEncontrado && clienteEncontrado.id) setCliente(clienteEncontrado);
          
          // Cargar reservas del usuario autenticado
          try {
            const reservasData = await reservasService.getMisReservas();
            console.log("Reservas cargadas:", reservasData);
            // Asegurar que reservasData es un array
            if (Array.isArray(reservasData)) {
              setReservas(reservasData);
            } else {
              console.warn("reservasData no es un array:", reservasData);
              setReservas([]);
            }
          } catch (reservasError) {
            console.log("No se pudieron cargar las reservas del usuario:", reservasError);
            setReservas([]);
          }
        } catch (authError) {
          console.log("Error cargando datos de usuario autenticado:", authError);
          setReservas([]); // Asegurar que reservas sea un array vacío
        }
      } else {
        // Usuario no autenticado - inicializar con valores vacíos
        setUsuario({ nombre: "", email: "" });
  // setCliente(null); // estado cliente deshabilitado temporalmente
        setReservas([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar datos");
      console.error("Error cargando datos:", err);
      // Asegurar que reservas sea un array vacío en caso de error
      setReservas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReservar = async (vehiculoId: number) => {
    const vehiculo = vehiculos.find((v) => v.id === vehiculoId);
    if (!vehiculo || vehiculo.estado !== "Disponible") {
      showToast('error', "Este vehículo no está disponible para reservar.");
      return;
    }

    // Validaciones de formulario (solo para no autenticado / datos manuales)
    if (!authService.isAuthenticated()) {
      if (!reservaForm.nombre.trim()) {
        showToast('warning', "El nombre es requerido");
        return;
      }
      if (!reservaForm.email.trim() || !reservaForm.email.includes("@")) {
        showToast('warning', "Email inválido");
        return;
      }
      if (!reservaForm.telefono.trim()) {
        showToast('warning', "El teléfono es requerido");
        return;
      }
    }
    if (!reservaForm.fechaVisita) {
      showToast('warning', "Selecciona una fecha de visita");
      return;
    }

    setLoading(true);
    try {
      const userInfo = authService.getUser();
      const isAuthenticated = authService.isAuthenticated() && userInfo;

      if (isAuthenticated) {
        await reservasService.create({ 
          vehiculoId,
          fechaVisita: reservaForm.fechaVisita 
        });
      } else {
        await reservasService.createPublic(vehiculoId, {
          nombre: reservaForm.nombre.trim(),
          email: reservaForm.email.trim(),
          telefono: reservaForm.telefono.trim(),
          fechaVisita: reservaForm.fechaVisita
        });
      }

      await cargarDatos();
      setShowReservaModal(false);
      showToast('success', "¡Reserva realizada con éxito! Fecha de visita: " + reservaForm.fechaVisita);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear reserva");
      showToast('error', "Error al realizar la reserva. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const abrirModalReserva = (vehiculo: Vehiculo) => {
    setVehiculoSeleccionado(vehiculo);
    const userInfo = authService.getUser();
    const isAuthenticated = authService.isAuthenticated() && userInfo;
    setReservaForm({
      nombre: isAuthenticated ? (userInfo?.nombre || "") : "",
      email: isAuthenticated ? (userInfo?.email || "") : "",
      telefono: "",
      fechaVisita: ""
    });
    setShowReservaModal(true);
  };

  const cerrarModalReserva = () => {
    if (!loading) {
      setShowReservaModal(false);
      setVehiculoSeleccionado(null);
    }
  };

  const handleCancelarReserva = async (reservaId: string) => {
    const confirmacion = window.confirm("¿Estás seguro de que quieres cancelar esta reserva?");
    if (!confirmacion) return;

    setLoading(true);
    try {
      await reservasService.cancel(reservaId);
      
      // Recargar datos para reflejar los cambios
      await cargarDatos();
      
      showToast('success', "Reserva cancelada con éxito.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cancelar reserva");
      showToast('error', "Error al cancelar la reserva. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const enviarWhatsAppReserva = (reserva: Reserva) => {
    const veh = reserva.vehiculo;
    const fechaVisita = reserva.fechaVisita ? new Date(reserva.fechaVisita).toLocaleDateString() : 'fecha no especificada';
    const mensaje = `Hola! Tengo una reserva confirmada para visitar el concesionario el día ${fechaVisita} y ver el vehículo ${veh ? `${veh.marca} ${veh.modelo}` : 'vehículo reservado'}. ¿Podrían confirmarme los detalles de la visita?`;
    const numeroWhatsApp = "5492216335590"; // Número del concesionario
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    
    window.open(urlWhatsApp, '_blank');
  };

  const handleLogout = () => {
    authService.logout();
  };
  
  // Función para aplicar filtros del lado del cliente
  // TODO: Mover filtros al backend para mejor performance con grandes datasets
  const vehiculosFiltrados = vehiculos
    .filter((vehiculo) => {
      // Búsqueda general
      if (busquedaGeneral) {
        const busqueda = busquedaGeneral.toLowerCase();
        const coincide = 
          vehiculo.marca.toLowerCase().includes(busqueda) ||
          vehiculo.modelo.toLowerCase().includes(busqueda) ||
          vehiculo.descripcion.toLowerCase().includes(busqueda);
        if (!coincide) return false;
      }
      
      // Filtro por marca
      if (filtroMarca && !vehiculo.marca.toLowerCase().includes(filtroMarca.toLowerCase())) {
        return false;
      }
      
      // Filtro por modelo
      if (filtroModelo && !vehiculo.modelo.toLowerCase().includes(filtroModelo.toLowerCase())) {
        return false;
      }
      
      // Filtro por año
      if (filtroAnio && vehiculo.anio.toString() !== filtroAnio) {
        return false;
      }
      
      // Filtro por precio mínimo
      if (filtroPrecioMin && vehiculo.precio < Number(filtroPrecioMin)) {
        return false;
      }
      
      // Filtro por precio máximo
      if (filtroPrecioMax && vehiculo.precio > Number(filtroPrecioMax)) {
        return false;
      }
      
      // Solo mostrar vehículos disponibles (o reservados para usuarios autenticados)
      return vehiculo.estado === 'Disponible' || vehiculo.estado === 'Reservado';
    })
    .sort((a, b) => {
      switch (ordenarPor) {
        case 'precio-asc':
          return a.precio - b.precio;
        case 'precio-desc':
          return b.precio - a.precio;
        case 'anio-desc':
          return b.anio - a.anio;
        case 'anio-asc':
          return a.anio - b.anio;
        case 'marca':
          return a.marca.localeCompare(b.marca);
        default:
          return 0;
      }
    });

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      cargarDatos(page);
    }
  };

  const limpiarFiltros = () => {
    setFiltroMarca("");
    setFiltroModelo("");
    setFiltroPrecioMin("");
    setFiltroPrecioMax("");
    setFiltroAnio("");
    setBusquedaGeneral("");
    setOrdenarPor("precio-asc");
    // Resetear paginación al limpiar filtros
    cargarDatos(1);
  };



  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FaCar className="text-blue-500" />
            AutoSales
          </h2>
          <p className="text-sm text-gray-600 mt-1">Catálogo de Vehículos</p>
        </div>
        
        <div className="p-4">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Bienvenido</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaUser className="text-gray-400" />
              <span>{usuario.nombre || "Cliente"}</span>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${
                seccionActiva === "catalogo" 
                  ? "bg-blue-500 text-white" 
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setSeccionActiva("catalogo")}
            >
              <FaCar />
              Catálogo de Vehículos
            </button>
            
            <button
              className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${
                seccionActiva === "reservas" 
                  ? "bg-blue-500 text-white" 
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setSeccionActiva("reservas")}
            >
              <FaCalendarAlt />
              Mis Reservas
              {Array.isArray(reservas) && reservas.filter(r => r.estado === "Activa").length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-auto">
                  {Array.isArray(reservas) ? reservas.filter(r => r.estado === "Activa").length : 0}
                </span>
              )}
            </button>
          </nav>

          <div className="mt-8 pt-6 border-t">
            <button
              onClick={handleLogout}
              className="w-full p-3 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-3 transition-colors"
            >
              <FaSignOutAlt />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {loading && (
            <div className="flex justify-center items-center p-8">
              <div className="text-lg">Cargando...</div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {seccionActiva === "catalogo" && (
            <div>
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Catálogo de Vehículos
                </h1>
                <p className="text-gray-600">
                  Explora nuestra selección de vehículos disponibles y reserva el que más te guste.
                </p>
              </div>

              {/* Filtros */}
              <div className="bg-white p-4 rounded-lg shadow mb-6">
                <h3 className="text-lg font-semibold mb-4">Filtros de búsqueda</h3>
                {/* Barra de búsqueda general */}
                <div className="mb-6">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={busquedaGeneral}
                      onChange={(e) => setBusquedaGeneral(e.target.value)}
                      placeholder="Buscar vehículos por marca, modelo o descripción..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    />
                  </div>
                </div>

                {/* Filtros avanzados */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <FaFilter className="mr-2 text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-800">Filtros Avanzados</h3>
                    </div>
                    <button
                      onClick={limpiarFiltros}
                      className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                    >
                      Limpiar
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Marca
                      </label>
                      <input
                        type="text"
                        value={filtroMarca}
                        onChange={(e) => setFiltroMarca(e.target.value)}
                        placeholder="Buscar por marca..."
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Modelo
                      </label>
                      <input
                        type="text"
                        value={filtroModelo}
                        onChange={(e) => setFiltroModelo(e.target.value)}
                        placeholder="Buscar por modelo..."
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Año
                      </label>
                      <input
                        type="number"
                        value={filtroAnio}
                        onChange={(e) => setFiltroAnio(e.target.value)}
                        placeholder="Año específico..."
                        min="1990"
                        max="2025"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio Mínimo
                      </label>
                      <input
                        type="number"
                        value={filtroPrecioMin}
                        onChange={(e) => setFiltroPrecioMin(e.target.value)}
                        placeholder="Precio mínimo..."
                        min="0"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio Máximo
                      </label>
                      <input
                        type="number"
                        value={filtroPrecioMax}
                        onChange={(e) => setFiltroPrecioMax(e.target.value)}
                        placeholder="Precio máximo..."
                        min="0"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ordenar por
                      </label>
                      <select
                        value={ordenarPor}
                        onChange={(e) => setOrdenarPor(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="precio-asc">Precio (menor a mayor)</option>
                        <option value="precio-desc">Precio (mayor a menor)</option>
                        <option value="anio-desc">Año (más nuevo)</option>
                        <option value="anio-asc">Año (más antiguo)</option>
                        <option value="marca">Marca (A-Z)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información de resultados */}
              <div className="mb-4">
                <p className="text-gray-600">
                  Mostrando {vehiculosFiltrados.length} vehículo{vehiculosFiltrados.length !== 1 ? 's' : ''} de {totalVehiculos} disponible{totalVehiculos !== 1 ? 's' : ''} (Página {currentPage} de {totalPages})
                </p>
              </div>

              {/* Grid de vehículos */}
              {vehiculosFiltrados.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vehiculosFiltrados.map((vehiculo, idx) => (
                    <div key={`${vehiculo.id}-${idx}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <img
                          src={getVehiculoImagenes(vehiculo)[0] || "/images/fotosautos/default.png"}
                          alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                          className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => { setVehiculoDetalle(vehiculo); setShowDetalleModal(true); }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/images/fotosautos/default.png";
                          }}
                        />
                        <div className="absolute top-4 right-4">
                          <span className={`text-white px-2 py-1 rounded-full text-sm font-medium ${
                            vehiculo.estado === 'Disponible' 
                              ? 'bg-green-500' 
                              : vehiculo.estado === 'Reservado'
                              ? 'bg-orange-500'
                              : 'bg-gray-500'
                          }`}>
                            {vehiculo.estado}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {vehiculo.marca} {vehiculo.modelo}
                        </h3>
                        <p className="text-gray-600 mb-2">Año: {vehiculo.anio}</p>
                        <p className="text-gray-700 text-sm mb-4">{vehiculo.descripcion}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold text-green-600">
                            ${vehiculo.precio.toLocaleString()}
                          </div>
                          <button
                            onClick={() => vehiculo.id && abrirModalReserva(vehiculo)}
                            disabled={loading || vehiculo.estado !== 'Disponible'}
                            className={`px-6 py-2 rounded-md font-medium transition-colors ${
                              vehiculo.estado === 'Disponible'
                                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                            } disabled:bg-gray-400 disabled:cursor-not-allowed`}
                          >
                            {loading ? "Reservando..." : 
                             vehiculo.estado === 'Disponible' ? "Reservar" : 
                             vehiculo.estado === 'Reservado' ? "Ya Reservado" : 
                             "No Disponible"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaCar className="mx-auto text-6xl text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No se encontraron vehículos
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {busquedaGeneral || filtroMarca || filtroModelo || filtroAnio || filtroPrecioMin || filtroPrecioMax 
                      ? "Intenta ajustar los filtros de búsqueda."
                      : "No hay vehículos disponibles en este momento."}
                  </p>
                  {(busquedaGeneral || filtroMarca || filtroModelo || filtroAnio || filtroPrecioMin || filtroPrecioMax) && (
                    <button
                      onClick={limpiarFiltros}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Limpiar filtros
                    </button>
                  )}
                </div>
              )}

              {/* Controles de paginación */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || loading}
                      className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    
                    {/* Números de página */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                      if (pageNum > totalPages) return null;
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          disabled={loading}
                          className={`px-3 py-2 rounded-md border ${
                            currentPage === pageNum
                              ? 'bg-blue-500 text-white border-blue-500'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || loading}
                      className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {seccionActiva === "reservas" && (
            <div>
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Mis Reservas
                </h1>
                <p className="text-gray-600">
                  Gestiona tus reservas de vehículos.
                </p>
              </div>

              {Array.isArray(reservas) && reservas.length > 0 ? (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vehículo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha de Reserva
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha de Visita
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Precio
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reservas.map((reserva, idx) => {
                        const fechaISO = reserva.fecha || reserva.fechaReserva;
                        const veh = reserva.vehiculo;
                        let fechaLegible = '—';
                        if (fechaISO) {
                          const d = new Date(fechaISO);
                          if (!isNaN(d.getTime())) fechaLegible = d.toLocaleDateString();
                        }
                        
                        // Formatear fecha de visita
                        let fechaVisitaLegible = '—';
                        if (reserva.fechaVisita) {
                          const dVisita = new Date(reserva.fechaVisita);
                          if (!isNaN(dVisita.getTime())) fechaVisitaLegible = dVisita.toLocaleDateString();
                        }
                        
                        return (
                          <tr key={`${reserva.id}-${idx}`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-12 w-12">
                                  <img
                                    className="h-12 w-12 rounded-md object-cover"
                                    src={veh ? getVehiculoImagenes(veh)[0] || "/images/fotosautos/default.png" : "/images/fotosautos/default.png"}
                                    alt={veh ? `${veh.marca} ${veh.modelo}` : 'Vehículo'}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {veh ? `${veh.marca} ${veh.modelo}` : 'Vehículo no disponible'}
                                  </div>
                                  <div className="text-sm text-gray-500">Año: {veh?.anio ?? '—'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fechaLegible}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fechaVisitaLegible}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                reserva.estado === 'Activa' ? 'bg-green-100 text-green-800'
                                : reserva.estado === 'Cancelada' ? 'bg-red-100 text-red-800'
                                : reserva.estado === 'Vencida' ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                              }`}>
                                {reserva.estado}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                              {veh?.precio ? `$${veh.precio.toLocaleString()}` : '—'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {reserva.estado === 'Activa' && (
                                <button
                                  onClick={() => handleCancelarReserva(reserva.id.toString())}
                                  disabled={loading}
                                  className="text-red-600 hover:text-red-900 disabled:text-gray-400"
                                >
                                  {loading ? 'Cancelando...' : 'Cancelar'}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaCalendarAlt className="mx-auto text-6xl text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No tienes reservas</h3>
                  <p className="text-gray-500 mb-4">Explora nuestro catálogo y reserva el vehículo que más te guste.</p>
                  <button
                    onClick={() => setSeccionActiva('catalogo')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
                  >
                    Ver Catálogo
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Modal de Reserva */}
      {showReservaModal && vehiculoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-xl overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">Reservar vehículo</h3>
              <button onClick={cerrarModalReserva} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-medium text-gray-600 mb-1">Vehículo a reservar</p>
                <p className="text-gray-800 font-semibold">{vehiculoSeleccionado.marca} {vehiculoSeleccionado.modelo} ({vehiculoSeleccionado.anio})</p>
                <p className="text-sm text-green-600 font-medium mt-1">Precio: ${vehiculoSeleccionado.precio.toLocaleString()}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {!authService.isAuthenticated() && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                      <input
                        type="text"
                        value={reservaForm.nombre}
                        onChange={(e)=>setReservaForm(f=>({...f,nombre:e.target.value}))}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="Juan Pérez"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={reservaForm.email}
                        onChange={(e)=>setReservaForm(f=>({...f,email:e.target.value}))}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="email@dominio.com"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                      <input
                        type="tel"
                        value={reservaForm.telefono}
                        onChange={(e)=>setReservaForm(f=>({...f,telefono:e.target.value}))}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="Ej: 11 5555 5555"
                      />
                    </div>
                  </>
                )}
                {authService.isAuthenticated() && (
                  <div className="md:col-span-2 text-sm text-gray-600 bg-blue-50 border border-blue-200 p-3 rounded">
                    ✅ Se utilizarán automáticamente los datos del usuario autenticado.
                  </div>
                )}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de visita</label>
                  <input
                    type="date"
                    min={hoy}
                    value={reservaForm.fechaVisita}
                    onChange={(e)=>setReservaForm(f=>({...f,fechaVisita:e.target.value}))}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Selecciona el día en que deseas visitar el concesionario.</p>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={cerrarModalReserva}
                  disabled={loading}
                  className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >Cancelar</button>
                <button
                  onClick={()=>vehiculoSeleccionado?.id && handleReservar(vehiculoSeleccionado.id)}
                  disabled={loading || !reservaForm.fechaVisita || (!authService.isAuthenticated() && (!reservaForm.nombre || !reservaForm.email || !reservaForm.telefono))}
                  className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >{loading?"Guardando...":"Confirmar Reserva"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalles */}
      {showDetalleModal && vehiculoDetalle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl overflow-hidden animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-gray-800">Detalles del Vehículo</h3>
              <button onClick={() => setShowDetalleModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{vehiculoDetalle.marca} {vehiculoDetalle.modelo}</h4>
                  <p className="text-gray-600 mb-2">Año: {vehiculoDetalle.anio}</p>
                  <p className="text-2xl font-bold text-green-600 mb-4">Precio: ${vehiculoDetalle.precio.toLocaleString()}</p>
                  <div className="mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      vehiculoDetalle.estado === 'Disponible' 
                        ? 'bg-green-100 text-green-800' 
                        : vehiculoDetalle.estado === 'Reservado'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {vehiculoDetalle.estado}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h5 className="font-semibold mb-2">Descripción</h5>
                    <p className="text-gray-700">{vehiculoDetalle.descripcion}</p>
                  </div>
                </div>
                <div>
                  <h5 className="font-semibold mb-4">Imágenes</h5>
                  <div className="grid grid-cols-1 gap-4">
                    {getVehiculoImagenes(vehiculoDetalle).map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${vehiculoDetalle.marca} ${vehiculoDetalle.modelo} - ${idx + 1}`}
                        className="w-full h-48 object-cover rounded-md"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/fotosautos/default.png";
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                <button
                  onClick={() => setShowDetalleModal(false)}
                  className="px-6 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
                >
                  Cerrar
                </button>
                {vehiculoDetalle.estado === 'Disponible' && (
                  <button
                    onClick={() => {
                      setShowDetalleModal(false);
                      abrirModalReserva(vehiculoDetalle);
                    }}
                    className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Reservar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalogo;
