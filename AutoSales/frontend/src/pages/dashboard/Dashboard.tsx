import { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { FaUsers, FaCar, FaChartPie, FaCog, FaHome, FaCalendarAlt, FaSignOutAlt, FaList } from "react-icons/fa";
import { dashboardService, DashboardStats, logsService, LogEvento } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const sidebarItems = [
  { id: "dashboard", icon: <FaChartPie />, label: "Dashboard" },
  { id: "usuarios", icon: <FaUsers />, label: "Gestión de Usuarios" },
  { id: "clientes", icon: <FaUsers />, label: "Gestión de Clientes" },
  { id: "vehiculos", icon: <FaCar />, label: "Gestión de Vehículos" },
  { id: "ventas", icon: <FaCalendarAlt />, label: "Gestión de Ventas" },
  { id: "reportes", icon: <FaChartPie />, label: "Reportes" },
  { id: "configuracion", icon: <FaCog />, label: "Configuración" }
];

import GestionUsuarios from "../gestion/GestionUsuarios";
import GestionClientes from "../gestion/GestionClientes";
import GestionVehiculos from "../gestion/GestionVehiculos";
import Reportes from "../reportes/Reportes";
import Configuracion from "../../components/Configuracion";
import VentasAdmin from '../gestion/VentasAdmin';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [seccionActiva, setSeccionActiva] = useState<string>("dashboard");
  const [tema, setTema] = useState<string>("claro");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [logs, setLogs] = useState<LogEvento[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [logsLoading, setLogsLoading] = useState<boolean>(false);
  const { logout } = useAuth();

  useEffect(() => {
    fetchStats();
    fetchLogs();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      setLogsLoading(true);
      const data = await logsService.getAll();
      setLogs(data);
    } catch (error) {
      console.error('Error al cargar logs:', error);
    } finally {
      setLogsLoading(false);
    }
  };

  const manejarCambioTema = (nuevoTema: string) => {
    setTema(nuevoTema);
    document.documentElement.classList.toggle("dark", nuevoTema === "oscuro");
  };

  // Datos para los gráficos usando estadísticas reales
  const ventasPorMes = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    datasets: [
      {
        label: "Ventas ($)",
        data: stats?.ventasMensuales || Array(12).fill(0),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const clientesPorEstado = {
    labels: Object.keys(stats?.clientesPorEstado || {}),
    datasets: [
      {
        label: "Clientes",
        data: Object.values(stats?.clientesPorEstado || {}),
        backgroundColor: ["#4CAF50", "#FFC107", "#F44336", "#2196F3"],
      },
    ],
  };

  const vehiculosData = {
    labels: Object.keys(stats?.vehiculosPorEstado || {}),
    datasets: [
      {
        label: "Vehículos",
        data: Object.values(stats?.vehiculosPorEstado || {}),
        backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
        borderColor: ["#4CAF50", "#FFC107", "#F44336"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className={`flex h-screen ${tema === "oscuro" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"}`}>
      {/* Sidebar */}
      <div className="w-1/5 h-full bg-gray-900 text-white p-5 flex flex-col">
        <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
          <FaHome /> AutoSales
        </h2>
        <ul className="space-y-4">
          {sidebarItems.map((item) => (
            <li
              key={item.id}
              className={`p-3 rounded-lg flex items-center gap-2 cursor-pointer transition-all duration-300 text-sm md:text-base ${
                seccionActiva === item.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
              onClick={() => setSeccionActiva(item.id)}
            >
              {item.icon} <span className="hidden sm:inline">{item.label}</span>
            </li>
          ))}
        </ul>
        
        {/* Botón de Logout */}
        <div className="mt-auto pt-4">
          <button
            onClick={logout}
            className="w-full p-3 rounded-lg flex items-center gap-2 cursor-pointer transition-all duration-300 text-sm md:text-base bg-red-600 hover:bg-red-700 text-white"
          >
            <FaSignOutAlt /> <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-4/5 h-full overflow-y-auto p-5">
        {seccionActiva === "dashboard" && (
          <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 flex items-center justify-between">
              Dashboard
              <button
                onClick={fetchStats}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? 'Actualizando...' : 'Actualizar'}
              </button>
            </h1>
            
            {loading ? (
              <div className="text-center">Cargando estadísticas...</div>
            ) : (
              <>
                {/* Tarjetas de resumen */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                      <FaUsers className="text-blue-500 text-3xl mr-4" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-700">Total Clientes</h3>
                        <p className="text-2xl font-bold text-blue-600">{stats?.totalClientes || 0}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                      <FaCar className="text-green-500 text-3xl mr-4" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-700">Total Vehículos</h3>
                        <p className="text-2xl font-bold text-green-600">{stats?.totalVehiculos || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                      <FaChartPie className="text-purple-500 text-3xl mr-4" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-700">Total Ventas</h3>
                        <p className="text-2xl font-bold text-purple-600">{stats?.totalVentas || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gráficos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Ventas Mensuales</h3>
                    <Bar data={ventasPorMes} />
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Clientes por Estado</h3>
                    <Pie data={clientesPorEstado} />
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Estado de Vehículos</h3>
                    <Pie data={vehiculosData} />
                  </div>
                </div>

                {/* Sección de Logs del Sistema */}
                <div className="mt-6">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <FaList className="text-blue-500" />
                        Logs del Sistema
                      </h3>
                      <button
                        onClick={fetchLogs}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                        disabled={logsLoading}
                      >
                        {logsLoading ? 'Cargando...' : 'Actualizar'}
                      </button>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {logsLoading ? (
                        <div className="text-center py-4">
                          <div className="text-gray-500">Cargando logs...</div>
                        </div>
                      ) : logs.length === 0 ? (
                        <div className="text-center py-4">
                          <div className="text-gray-500">No hay logs disponibles</div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {logs.slice(0, 10).map((log) => (
                            <div
                              key={log.id}
                              className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                      log.tipo === 'CREAR_RESERVA' ? 'bg-green-100 text-green-800' :
                                      log.tipo === 'ACTUALIZAR_RESERVA' ? 'bg-blue-100 text-blue-800' :
                                      log.tipo === 'CANCELAR_RESERVA' ? 'bg-red-100 text-red-800' :
                                      log.tipo === 'ERROR_VALIDACION' ? 'bg-red-100 text-red-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {log.tipo}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs ${
                                      log.actor.tipo === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                                      log.actor.tipo === 'CLIENTE' ? 'bg-green-100 text-green-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {log.actor.tipo}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700 mb-1">
                                    {log.mensaje}
                                  </p>
                                  <div className="text-xs text-gray-500">
                                    {log.actor.nombre && `Por: ${log.actor.nombre}`} • 
                                    {new Date(log.timestampISO).toLocaleString('es-ES')}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {logs.length > 10 && (
                      <div className="mt-3 text-center">
                        <span className="text-sm text-gray-500">
                          Mostrando los últimos 10 de {logs.length} logs
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        {seccionActiva === "usuarios" && <GestionUsuarios />}
        {seccionActiva === "clientes" && <GestionClientes />}
        {seccionActiva === "vehiculos" && <GestionVehiculos />}
  {seccionActiva === "ventas" && <VentasAdmin />}
        {seccionActiva === "reportes" && <Reportes />}
        {seccionActiva === "configuracion" && (
          <Configuracion
            onCambiarTema={manejarCambioTema}
            onCambiarIdioma={() => {}}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;