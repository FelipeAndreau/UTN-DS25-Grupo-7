    import DashboardAdmin from './DashboardAdmin';
    import DashboardUser from './DashboardUser';

    export default function DashboardLayout({ userRole }) {
    return (
        <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-8">AutoSales</h2>
            <nav className="space-y-4">
            <a href="#" className="block text-gray-700 hover:text-blue-600">Inicio</a>
            <a href="#" className="block text-gray-700 hover:text-blue-600">Vehículos</a>
            <a href="#" className="block text-gray-700 hover:text-blue-600">Reservas</a>
            <a href="#" className="block text-gray-700 hover:text-blue-600">Configuración</a>
            </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-10 overflow-y-auto">
            {userRole === 'admin' && <DashboardAdmin />}
            {userRole === 'user' && <DashboardUser />}
        </main>
        </div>
    );
}