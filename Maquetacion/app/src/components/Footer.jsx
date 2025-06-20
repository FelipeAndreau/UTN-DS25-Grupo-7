import React from "react";
import { Box, Typography, Grid, Link } from "@mui/material";

export default function Footer() {
  return (
    <Box component="footer" bgcolor="primary.dark" color="white" py={6} mt={8}>
      <Grid container spacing={4} justifyContent="center" px={{ xs: 2, md: 8 }}>
        <Grid item xs={12} md={3}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            AutoSales
          </Typography>
          <Typography variant="body2">
            Tu concesionario de confianza para encontrar el vehículo perfecto a precios competitivos.
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Enlaces rápidos
          </Typography>
          <Box>
            <Link href="#hero" color="inherit" underline="hover" display="block">Inicio</Link>
            <Link href="#catalogo" color="inherit" underline="hover" display="block">Catálogo</Link>
            <Link href="#contacto" color="inherit" underline="hover" display="block">Contacto</Link>
            <Link href="#servicios" color="inherit" underline="hover" display="block">Financiamiento</Link>
            <Link href="#servicios" color="inherit" underline="hover" display="block">Servicio técnico</Link>
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Vehículos
          </Typography>
          <Box>
            <Link href="#vehiculos" color="inherit" underline="hover" display="block">Nuevos</Link>
            <Link href="#vehiculos" color="inherit" underline="hover" display="block">Seminuevos</Link>
            <Link href="#vehiculos" color="inherit" underline="hover" display="block">Usados</Link>
            <Link href="#catalogo" color="inherit" underline="hover" display="block">Ofertas especiales</Link>
            <Link href="#contacto" color="inherit" underline="hover" display="block">Vende tu auto</Link>
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Contacto
          </Typography>
          <Box>
            <Typography variant="body2">📍 Calle 13, La Plata</Typography>
            <Typography variant="body2">📞 (+54) 221 633-5590</Typography>
            <Typography variant="body2">✉️ info@autosales.com</Typography>
          </Box>
        </Grid>
      </Grid>
      <Box textAlign="center" mt={6} color="grey.400">
        <Typography variant="caption">
          © 2025 AutoSales. Todos los derechos reservados.
        </Typography>
      </Box>
    </Box>
  );
}
