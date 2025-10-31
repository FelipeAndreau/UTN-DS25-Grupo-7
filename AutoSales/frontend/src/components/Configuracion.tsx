import { useState } from "react";

interface ConfiguracionProps {
  onCambiarTema: (nuevoTema: string) => void;
  onCambiarIdioma: (nuevoIdioma: string) => void;
}

const Configuracion = ({ onCambiarTema, onCambiarIdioma }: ConfiguracionProps) => {
   const [tema, setTema] = useState<string>("claro");
  const [idioma, setIdioma] = useState<string>("es");

  const manejarCambioTema = (nuevoTema: string) => {
    setTema(nuevoTema);
    onCambiarTema(nuevoTema); // Notificar al Dashboard
  };

  const manejarCambioIdioma = (nuevoIdioma: string) => {
    setIdioma(nuevoIdioma);
    onCambiarIdioma(nuevoIdioma); // Notificar al Dashboard
  };

  const restablecerConfiguracion = () => {
    setTema("claro");
    setIdioma("es");
    onCambiarTema("claro");
    onCambiarIdioma("es");
    alert("Configuraciones restablecidas a los valores predeterminados.");
  };

  return (
    <div className="w-full h-full p-5 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-5">Configuración</h2>

      {/* Configuración de Tema */}
      <div className="mb-5">
        <h3 className="text-lg font-semibold mb-3">Tema</h3>
        <div className="flex gap-4">
          <button
            className={`p-2 rounded-md ${
              tema === "claro"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => manejarCambioTema("claro")}
          >
            Claro
          </button>
          <button
            className={`p-2 rounded-md ${
              tema === "oscuro"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => manejarCambioTema("oscuro")}
          >
            Oscuro
          </button>
        </div>
      </div>

      {/* Configuración de Idioma */}
      <div className="mb-5">
        <h3 className="text-lg font-semibold mb-3">Idioma</h3>
        <select
          value={idioma}
          onChange={(e) => manejarCambioIdioma(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="es">Español</option>
          <option value="en">Inglés</option>
          <option value="fr">Francés</option>
        </select>
      </div>

      {/* Restablecer Configuración */}
      <div className="mt-5">
        <button
          onClick={restablecerConfiguracion}
          className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Restablecer Configuración
        </button>
      </div>
    </div>
  );
};

export default Configuracion;