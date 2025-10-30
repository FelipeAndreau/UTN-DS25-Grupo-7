import { useState } from "react";
import { Bar } from "react-chartjs-2";

const ventasData = {
  labels: ["Enero", "Febrero", "Marzo", "Abril"],
  datasets: [
    {
      label: "Ventas ($)",
      data: [12000, 15000, 8000, 20000],
      backgroundColor: "rgba(75, 192, 192, 0.6)",
    },
  ],
};

const clientesPorMes = {
  labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
  datasets: [
    {
      label: "Clientes Nuevos",
      data: [5, 10, 8, 15, 12, 20],
      backgroundColor: "rgba(75, 192, 192, 0.6)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
    },
  ],
};

const vehiculosPorMes = {
  labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
  datasets: [
    {
      label: "Vehículos Vendidos",
      data: [10, 15, 12, 20, 18, 25],
      backgroundColor: "rgba(255, 99, 132, 0.6)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1,
    },
  ],
};

const Reportes = () => {
  const [tipoReporte, setTipoReporte] = useState("ventas");

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true } },
    plugins: { legend: { position: "top" as const } },
  };

  const chartClass = "relative h-80";

  const renderReporte = () => {
    switch (tipoReporte) {
      case "ventas":
        return (
          <>
            <h3 className="text-lg font-bold mb-3">Reporte de Ventas</h3>
            <div className={chartClass}>
              <Bar data={ventasData} options={chartOptions} />
            </div>
          </>
        );
      case "clientes":
        return (
          <>
            <h3 className="text-lg font-bold mb-3">Reporte de Clientes</h3>
            <div className={chartClass}>
              <Bar data={clientesPorMes} options={chartOptions} />
            </div>
          </>
        );
      case "vehiculos":
        return (
          <>
            <h3 className="text-lg font-bold mb-3">Reporte de Vehículos</h3>
            <div className={chartClass}>
              <Bar data={vehiculosPorMes} options={chartOptions} />
            </div>
          </>
        );
      default:
        return <p>Selecciona un tipo de reporte.</p>;
    }
  };

  return (
    <div className="w-full h-full p-2 bg-white rounded-lg shadow-lg mt-2 mb-24">
      <h2 className="text-xl font-bold mb-5">Reportes</h2>

      {/* Selector de tipo de reporte */}
      <div className="flex gap-4 mb-5">
        <button
          className={`p-2 rounded-md ${
            tipoReporte === "ventas"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setTipoReporte("ventas")}
        >
          Ventas
        </button>
        <button
          className={`p-2 rounded-md ${
            tipoReporte === "clientes"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setTipoReporte("clientes")}
        >
          Clientes
        </button>
        <button
          className={`p-2 rounded-md ${
            tipoReporte === "vehiculos"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setTipoReporte("vehiculos")}
        >
          Vehículos
        </button>
      </div>

      {/* contenido del reporte */}
      <div className="p-5 border border-gray-300 rounded-md">
        {renderReporte()}
      </div>
    </div>
  );
};

export default Reportes;