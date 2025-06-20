import React from "react";

export default function Header() {
  return (
    <header className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <h1 className="text-3xl font-bold tracking-wide cursor-pointer">AutoSales</h1>

        <nav className="hidden md:block">
          <ul className="flex space-x-8 text-lg font-medium">
            <li>
              <a href="#hero" className="hover:text-yellow-400 transition-colors duration-300">
                Inicio
              </a>
            </li>
            <li>
              <a href="#vehiculos" className="hover:text-yellow-400 transition-colors duration-300">
                Vehículos
              </a>
            </li>
            <li>
              <a href="#servicios" className="hover:text-yellow-400 transition-colors duration-300">
                Servicios
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
          </ul>
        </nav>

        <button
          className="md:hidden text-3xl hover:text-yellow-400 transition-colors duration-300"
          aria-label="Abrir menú"
        >
          ☰
        </button>
      </div>
    </header>
  );
}
