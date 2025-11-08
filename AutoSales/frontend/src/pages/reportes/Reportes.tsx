import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { logsService, dashboardService, type LogEvento, type DashboardStats } from "../../services/api";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Reportes = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEvento[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // Colores para los gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar logs del sistema
      const logsData = await logsService.getAll();
      setLogs(logsData);

      // Cargar estadísticas del dashboard
      const statsData = await dashboardService.getStats();
      setDashboardStats(statsData);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar datos");
      console.error("Error cargando datos de reportes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMonthChange = (event: SelectChangeEvent<number>) => {
    setSelectedMonth(event.target.value as number);
  };

  // Preparar datos para gráficos de ventas mensuales
  const ventasMensualesData = dashboardStats ? [
    { mes: 'Ene', ventas: dashboardStats.ventasMensuales[0] || 0 },
    { mes: 'Feb', ventas: dashboardStats.ventasMensuales[1] || 0 },
    { mes: 'Mar', ventas: dashboardStats.ventasMensuales[2] || 0 },
    { mes: 'Abr', ventas: dashboardStats.ventasMensuales[3] || 0 },
    { mes: 'May', ventas: dashboardStats.ventasMensuales[4] || 0 },
    { mes: 'Jun', ventas: dashboardStats.ventasMensuales[5] || 0 },
    { mes: 'Jul', ventas: dashboardStats.ventasMensuales[6] || 0 },
    { mes: 'Ago', ventas: dashboardStats.ventasMensuales[7] || 0 },
    { mes: 'Sep', ventas: dashboardStats.ventasMensuales[8] || 0 },
    { mes: 'Oct', ventas: dashboardStats.ventasMensuales[9] || 0 },
    { mes: 'Nov', ventas: dashboardStats.ventasMensuales[10] || 0 },
    { mes: 'Dic', ventas: dashboardStats.ventasMensuales[11] || 0 },
  ] : [];

  // Preparar datos para gráfico de clientes por estado
  const clientesPorEstadoData = dashboardStats ? Object.entries(dashboardStats.clientesPorEstado).map(([estado, cantidad]) => ({
    name: estado,
    value: cantidad
  })) : [];

  // Preparar datos para gráfico de vehículos por estado
  const vehiculosPorEstadoData = dashboardStats ? Object.entries(dashboardStats.vehiculosPorEstado).map(([estado, cantidad]) => ({
    name: estado,
    value: cantidad
  })) : [];

  // Preparar datos para tabla de logs recientes
  const logsRecientes = logs.slice(-10).reverse();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando reportes...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Reportes y Analytics
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="reportes tabs">
        <Tab label="Dashboard General" sx={{ color: '#000 !important' }} />
        <Tab label="Ventas" sx={{ color: '#000 !important' }} />
        <Tab label="Clientes" sx={{ color: '#000 !important' }} />
        <Tab label="Vehículos" sx={{ color: '#000 !important' }} />
        <Tab label="Logs del Sistema" sx={{ color: '#000 !important' }} />
        </Tabs>
      </Box>

      {/* Dashboard General */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* Estadísticas principales */}
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Clientes
                </Typography>
                <Typography variant="h4" component="div">
                  {dashboardStats?.totalClientes || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Vehículos
                </Typography>
                <Typography variant="h4" component="div">
                  {dashboardStats?.totalVehiculos || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Ventas del Mes
                </Typography>
                <Typography variant="h4" component="div">
                  {dashboardStats?.ventasMensuales[new Date().getMonth()] || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Logs
                </Typography>
                <Typography variant="h4" component="div">
                  {logs.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Gráfico de ventas mensuales */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Ventas Mensuales
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={ventasMensualesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="ventas"
                      stroke="#8884d8"
                      strokeWidth={2}
                      name="Ventas"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Gráfico de distribución de clientes */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Clientes por Estado
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={clientesPorEstadoData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {clientesPorEstadoData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Reporte de Ventas */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Ventas Mensuales Detalladas
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={ventasMensualesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ventas" fill="#8884d8" name="Cantidad de Ventas" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Reporte de Clientes */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Distribución de Clientes por Estado
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={clientesPorEstadoData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {clientesPorEstadoData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Estadísticas de Clientes
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {Object.entries(dashboardStats?.clientesPorEstado || {}).map(([estado, cantidad]) => (
                    <Box key={estado} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>{estado}:</Typography>
                      <Chip label={cantidad} color="primary" size="small" />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Reporte de Vehículos */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Distribución de Vehículos por Estado
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={vehiculosPorEstadoData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {vehiculosPorEstadoData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Estadísticas de Vehículos
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {Object.entries(dashboardStats?.vehiculosPorEstado || {}).map(([estado, cantidad]) => (
                    <Box key={estado} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>{estado}:</Typography>
                      <Chip label={cantidad} color="primary" size="small" />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Logs del Sistema */}
      <TabPanel value={tabValue} index={4}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Logs del Sistema - Actividad Reciente
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Total de logs registrados: {logs.length}
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Fecha/Hora</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Actor</TableCell>
                        <TableCell>Mensaje</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {logsRecientes.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            {new Date(log.timestampISO).toLocaleString('es-ES')}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={log.tipo.replace('_', ' ')}
                              color={
                                log.tipo === 'CREAR_RESERVA' ? 'success' :
                                log.tipo === 'CANCELAR_RESERVA' ? 'error' :
                                log.tipo === 'ERROR_VALIDACION' ? 'warning' :
                                'default'
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {log.actor.nombre || log.actor.id}
                          </TableCell>
                          <TableCell>{log.mensaje}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default Reportes;