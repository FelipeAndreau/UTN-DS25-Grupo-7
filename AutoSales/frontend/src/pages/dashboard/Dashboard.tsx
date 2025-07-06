import { useState } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
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
import { FaUsers, FaCar, FaChartPie, FaCog, FaHome, FaCalendarAlt } from "react-icons/fa";
import GestionUsuarios from "../gestion/GestionUsuarios";
import GestionClientes from "../gestion/GestionClientes";
import GestionVehiculos from "../gestion/GestionVehiculos";
import Reportes from "../reportes/Reportes";
import Configuracion from "../../components/Configuracion";

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

  const manejarCambioTema = (nuevoTema: string) => {
    setTema(nuevoTema);
    document.documentElement.classList.toggle("dark", nuevoTema === "oscuro");
  };

  // Datos para los gráficos
  const ventasPorMes = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
    datasets: [
      {
        label: "Ventas ($)",
        data: [12000, 15000, 8000, 20000, 17000, 25000],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const clientesPorEstado = {
    labels: ["Activos", "Potenciales", "Inactivos"],
    datasets: [
      {
        label: "Clientes",
        data: [30, 20, 10],
        backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
      },
    ],
  };

  const vehiculosData = {
    labels: ["Disponibles", "Reservados", "Vendidos"],
    datasets: [
      {
        label: "Vehículos",
        data: [60, 20, 20],
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
          {[
            { id: "dashboard", icon: <FaChartPie />, label: "Dashboard" },
            { id: "usuarios", icon: <FaUsers />, label: "Gestión de Usuarios" },
            { id: "clientes", icon: <FaUsers />, label: "Gestión de Clientes" },
            { id: "vehiculos", icon: <FaCar />, label: "Gestión de Vehículos" },
            { id: "reportes", icon: <FaChartPie />, label: "Reportes" },
            { id: "configuracion", icon: <FaCog />, label: "Configuración" },
          ].map((item) => (
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
      </div>

      {/* Main Content */}
      <div className="w-4/5 h-full overflow-y-auto p-5">
        {seccionActiva === "dashboard" && (
          <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h1>
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
          </div>
        )}
        {seccionActiva === "usuarios" && <GestionUsuarios />}
        {seccionActiva === "clientes" && <GestionClientes />}
        {seccionActiva === "vehiculos" && <GestionVehiculos />}
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
