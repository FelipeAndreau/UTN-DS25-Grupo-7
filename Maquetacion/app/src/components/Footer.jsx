import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 mt-12 shadow-inner">
      <div className="w-full px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {/* Sección AutoSales */}
        <div>
          <h4 className="text-white text-2xl font-bold mb-4 cursor-default">AutoSales</h4>
          <p className="text-sm leading-relaxed mb-6">
            Tu concesionario de confianza para encontrar el vehículo perfecto a precios competitivos.
          </p>
          <div className="flex space-x-6 text-sm font-semibold">
            <a href="#" className="hover:text-yellow-400 transition-colors duration-300">
              Facebook
            </a>
            <a href="#" className="hover:text-yellow-400 transition-colors duration-300">
              Twitter
            </a>
            <a href="#" className="hover:text-yellow-400 transition-colors duration-300">
              Instagram
            </a>
          </div>
        </div>

        {/* Enlaces rápidos */}
        <div>
          <h5 className="text-white font-semibold text-xl mb-4 cursor-default">Enlaces rápidos</h5>
          <ul className="space-y-3 text-sm font-medium">
            <li>
              <a href="#hero" className="hover:text-yellow-400 transition-colors duration-300">
                Inicio
              </a>
            </li>
            <li>
              <a href="#catalogo" className="hover:text-yellow-400 transition-colors duration-300">
                Catálogo
              </a>
            </li>
            <li>
              <a href="#contacto" className="hover:text-yellow-400 transition-colors duration-300">
                Contacto
              </a>
            </li>
            <li>
              <a href="#servicios" className="hover:text-yellow-400 transition-colors duration-300">
                Financiamiento
              </a>
            </li>
            <li>
              <a href="#servicios" className="hover:text-yellow-400 transition-colors duration-300">
                Servicio técnico
              </a>
            </li>
          </ul>
        </div>

        {/* Vehículos */}
        <div>
          <h5 className="text-white font-semibold text-xl mb-4 cursor-default">Vehículos</h5>
          <ul className="space-y-3 text-sm font-medium">
            <li>
              <a href="#vehiculos" className="hover:text-yellow-400 transition-colors duration-300">
                Nuevos
              </a>
            </li>
            <li>
              <a href="#vehiculos" className="hover:text-yellow-400 transition-colors duration-300">
                Seminuevos
              </a>
            </li>
            <li>
              <a href="#vehiculos" className="hover:text-yellow-400 transition-colors duration-300">
                Usados
              </a>
            </li>
            <li>
              <a href="#catalogo" className="hover:text-yellow-400 transition-colors duration-300">
                Ofertas especiales
              </a>
            </li>
            <li>
              <a href="#contacto" className="hover:text-yellow-400 transition-colors duration-300">
                Vende tu auto
              </a>
            </li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h5 className="text-white font-semibold text-xl mb-4 cursor-default">Contacto</h5>
          <ul className="space-y-3 text-sm font-medium">
            <li>📍 Calle 13, La Plata</li>
            <li>📞 (+54) 221 633-5590</li>
            <li>✉️ info@autosales.com</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto text-center text-gray-500 text-xs mt-10 border-t border-gray-700 pt-4 select-none">
        © 2025 AutoSales. Todos los derechos reservados.
      </div>
    </footer>
  );
}
