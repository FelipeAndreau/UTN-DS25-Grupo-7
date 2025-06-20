import { useState } from 'react';
import {
  Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, AppBar, Typography,
  CssBaseline, Divider, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 220;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon /> },
  { text: 'Reportes', icon: <AssessmentIcon /> },
  { text: 'Autos en stock', icon: <DirectionsCarIcon /> },
  { text: 'Clientes', icon: <PeopleIcon /> },
  { text: 'Salir', icon: <LogoutIcon /> },
];

const reportes = [
  { id: 1, titulo: 'Ventas de la semana', valor: 8 },
  { id: 2, titulo: 'Reservas pendientes', valor: 2 },
  { id: 3, titulo: 'Consultas recibidas', valor: 5 },
];

const autos = [
  { id: 1, modelo: 'Toyota Corolla', año: 2023, stock: 5 },
  { id: 2, modelo: 'Peugeot 208', año: 2023, stock: 3 },
  { id: 3, modelo: 'Renault Sandero', año: 2024, stock: 4 },
];

const clientes = [
  { id: 1, nombre: 'Juan Pérez', email: 'juanperez@mail.com', compras: 2 },
  { id: 2, nombre: 'Ana Gómez', email: 'anagomez@mail.com', compras: 1 },
  { id: 3, nombre: 'Carlos Ruiz', email: 'carlosruiz@mail.com', compras: 3 },
];

function DashboardBlock() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Paper elevation={4} sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <AssessmentIcon color="primary" sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h6">Reportes</Typography>
            <Typography variant="body2" color="text.secondary">
              3 reportes nuevos hoy
            </Typography>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper elevation={4} sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <DirectionsCarIcon color="success" sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h6">Autos en Stock</Typography>
            <Typography variant="body2" color="text.secondary">
              25 vehículos disponibles
            </Typography>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper elevation={4} sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <PeopleIcon color="info" sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h6">Clientes</Typography>
            <Typography variant="body2" color="text.secondary">
              120 clientes registrados
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

function ReportesBlock() {
  return (
    <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, mb: 4 }}>
      <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
        Reportes
      </Typography>
      <Grid container spacing={2}>
        {reportes.map((r) => (
          <Grid item xs={12} sm={4} key={r.id}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.light' }}>
              <Typography variant="h6">{r.titulo}</Typography>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {r.valor}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

function AutosBlock() {
  return (
    <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, mb: 4 }}>
      <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
        Autos en stock
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Modelo</TableCell>
              <TableCell>Año</TableCell>
              <TableCell>Stock</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {autos.map((auto) => (
              <TableRow key={auto.id}>
                <TableCell>{auto.modelo}</TableCell>
                <TableCell>{auto.año}</TableCell>
                <TableCell>{auto.stock}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

function ClientesBlock() {
  return (
    <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, mb: 4 }}>
      <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
        Clientes
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Compras</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.nombre}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.compras}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default function DashboardAdmin() {
  const [selected, setSelected] = useState(0);
  const isMobile = useMediaQuery('(max-width:600px)');

  let content;
  if (selected === 0) content = (
    <>
      <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
        Panel de Administrador
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={4}>
        Bienvenido, admin. Aquí podés gestionar el sistema.
      </Typography>
      <Box sx={{ mb: 4 }}>
        <DashboardBlock />
      </Box>
    </>
  );
  if (selected === 1) content = <ReportesBlock />;
  if (selected === 2) content = <AutosBlock />;
  if (selected === 3) content = <ClientesBlock />;
  if (selected === 4) content = <Typography variant="h6" sx={{ mt: 4 }}>Sesión finalizada.</Typography>;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6fa' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'primary.main',
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" fontWeight="bold">
            AutoSales - Admin
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={!isMobile || undefined}
        onClose={() => {}}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'white',
            borderRight: '1px solid #e0e0e0',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item, idx) => (
              <ListItem
                button
                key={item.text}
                selected={selected === idx}
                onClick={() => setSelected(idx)}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  color: selected === idx ? 'primary.main' : 'inherit',
                  bgcolor: selected === idx ? 'primary.light' : 'transparent',
                  '&:hover': { bgcolor: 'primary.light', color: 'primary.main' },
                  transition: 'all 0.2s',
                }}
              >
                <ListItemIcon sx={{ color: selected === idx ? 'primary.main' : 'grey.600' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#f4f6fa',
          minHeight: '100vh',
          p: { xs: 2, md: 4 },
          pt: { xs: 10, md: 12 },
          transition: 'padding 0.2s',
        }}
      >
        {content}
      </Box>
    </Box>
  );
}