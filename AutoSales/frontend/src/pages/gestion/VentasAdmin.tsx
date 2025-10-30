import React, { useEffect, useState } from 'react';
import { ventasService, clientesService, vehiculosService, Venta, Cliente, Vehiculo } from '../../services/api';
import CalendarModal from '../../components/CalendarModal';

interface VentaForm {
  clienteId: string;
  vehiculoId: string;
  fecha: string;
  monto: string;
}

const VentasAdmin = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [editingVenta, setEditingVenta] = useState<Venta | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [form, setForm] = useState<VentaForm>({ 
    clienteId: '', 
    vehiculoId: '', 
    fecha: '', 
    monto: '' 
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ventasData, clientesData, vehiculosData] = await Promise.all([
        ventasService.getAll(),
        clientesService.getAll(),
        vehiculosService.getAll()
      ]);
      setVentas(ventasData);
      setClientes(clientesData);
      setVehiculos(vehiculosData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCalendar = () => setShowCalendar(true);

  const handleDateSelect = (date: Date) => {
    const fechaString = date.toISOString().split('T')[0];
    setForm({ ...form, fecha: fechaString });
    setSelectedDate(date);
    setShowCalendar(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const ventaData = {
        clienteId: form.clienteId,
        vehiculoId: parseInt(form.vehiculoId),
        fecha: form.fecha ? new Date(form.fecha + 'T00:00:00.000Z').toISOString() : new Date().toISOString(),
        monto: parseFloat(form.monto)
      };

      console.log('💾 Datos de venta a enviar:', ventaData);

      if (editingVenta) {
        await ventasService.update(editingVenta.id!, ventaData);
      } else {
        await ventasService.create(ventaData);
      }
      
      setForm({ clienteId: '', vehiculoId: '', fecha: '', monto: '' });
      setEditingVenta(null);
      setSelectedDate(null);
      await fetchData();
      alert(editingVenta ? 'Venta actualizada exitosamente' : 'Venta creada exitosamente');
    } catch (error) {
      console.error('Error al guardar venta:', error);
      alert('Error al guardar la venta');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (venta: Venta) => {
    setEditingVenta(venta);
    setForm({
      clienteId: venta.clienteId,
      vehiculoId: venta.vehiculoId.toString(),
      fecha: venta.fecha.split('T')[0], // Formatear fecha para input
      monto: venta.monto.toString(),
    });
    setSelectedDate(new Date(venta.fecha));
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta venta?')) return;
    
    setLoading(true);
    try {
      await ventasService.delete(id);
      await fetchData();
      alert('Venta eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar venta:', error);
      alert('Error al eliminar la venta');
    } finally {
      setLoading(false);
    }
  };

  const handleCompletar = async (id: number) => {
    if (!confirm('¿Estás seguro de completar esta venta? El vehículo será marcado como vendido.')) return;
    
    setLoading(true);
    try {
      await ventasService.completar(id);
      await fetchData();
      alert('Venta completada exitosamente');
    } catch (error) {
      console.error('Error al completar venta:', error);
      alert('Error al completar la venta');
    } finally {
      setLoading(false);
    }
  };

  const getClienteNombre = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente?.nombre || 'Cliente no encontrado';
  };

  const getVehiculoNombre = (vehiculoId: number) => {
    const vehiculo = vehiculos.find(v => v.id === vehiculoId);
    return vehiculo ? `${vehiculo.marca} ${vehiculo.modelo}` : 'Vehículo no encontrado';
  };

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="text-center">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Gestión de Ventas</h2>
      
      <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4 mb-6 flex flex-col gap-3">
        <select
          className="border p-2 rounded"
          name="clienteId"
          value={form.clienteId}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar Cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombre} - {cliente.email}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          name="vehiculoId"
          value={form.vehiculoId}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar Vehículo</option>
          {vehiculos.map((vehiculo) => (
            <option key={vehiculo.id} value={vehiculo.id}>
              {vehiculo.marca} {vehiculo.modelo} ({vehiculo.anio}) - ${vehiculo.precio}
            </option>
          ))}
        </select>

        <div className="flex gap-2 items-center">
          <input
            className="border p-2 rounded flex-1"
            name="fecha"
            placeholder="Fecha"
            type="date"
            value={form.fecha}
            onChange={handleChange}
            required
          />
          <button 
            type="button" 
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" 
            onClick={handleCalendar}
          >
            📅 Calendario
          </button>
        </div>

        <input
          className="border p-2 rounded"
          name="monto"
          placeholder="Monto"
          type="number"
          step="0.01"
          value={form.monto}
          onChange={handleChange}
          required
        />

        <button 
          className="bg-green-600 text-white py-2 rounded mt-2 hover:bg-green-700 disabled:opacity-50" 
          type="submit"
          disabled={loading}
        >
          {loading ? 'Guardando...' : (editingVenta ? 'Actualizar Venta' : 'Crear Venta')}
        </button>
        
        {editingVenta && (
          <button 
            type="button"
            className="bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
            onClick={() => {
              setEditingVenta(null);
              setForm({ clienteId: '', vehiculoId: '', fecha: '', monto: '' });
              setSelectedDate(null);
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Cliente</th>
              <th className="p-3 text-left">Vehículo</th>
              <th className="p-3 text-left">Fecha</th>
              <th className="p-3 text-left">Monto</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta) => (
              <tr key={venta.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  {venta.cliente ? venta.cliente.nombre : getClienteNombre(venta.clienteId)}
                </td>
                <td className="p-3">
                  {venta.vehiculo ? 
                    `${venta.vehiculo.marca} ${venta.vehiculo.modelo}` : 
                    getVehiculoNombre(venta.vehiculoId)
                  }
                </td>
                <td className="p-3">
                  {new Date(venta.fecha).toLocaleDateString()}
                </td>
                <td className="p-3">
                  ${venta.monto.toLocaleString()}
                </td>
                <td className="p-3 flex gap-2">
                  <button 
                    className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500" 
                    onClick={() => handleEdit(venta)}
                    disabled={loading}
                  >
                    Editar
                  </button>
                  <button 
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600" 
                    onClick={() => venta.id && handleCompletar(venta.id)}
                    disabled={loading}
                  >
                    Completar
                  </button>
                  <button 
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" 
                    onClick={() => venta.id && handleDelete(venta.id)}
                    disabled={loading}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {ventas.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No hay ventas registradas
          </div>
        )}
      </div>

      {showCalendar && (
        <CalendarModal 
          onSelect={(date) => handleDateSelect(new Date(date))} 
          onClose={() => setShowCalendar(false)} 
          selected={selectedDate ? selectedDate.toISOString().split('T')[0] : null} 
        />
      )}
    </div>
  );
};

export default VentasAdmin;