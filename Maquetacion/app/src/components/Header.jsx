import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const navItems = [
  { label: "Inicio", href: "#hero" },
  { label: "Vehículos", href: "#vehiculos" },
  { label: "Servicios", href: "#servicios" },
  { label: "Catálogo", href: "#catalogo" },
  { label: "Contacto", href: "#contacto" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:900px)");

  return (
    <AppBar position="sticky" color="primary" elevation={2}>
      <Toolbar>
        <Typography variant="h5" fontWeight="bold" sx={{ flexGrow: 1, cursor: "pointer" }}>
          AutoSales
        </Typography>
        {isMobile ? (
          <>
            <IconButton color="inherit" onClick={() => setOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
              <Box sx={{ width: 220, mt: 4 }}>
                <List>
                  {navItems.map((item) => (
                    <ListItem button key={item.label} component="a" href={item.href} onClick={() => setOpen(false)}>
                      <ListItemText primary={item.label} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
          <Box>
            {navItems.map((item) => (
              <Typography
                key={item.label}
                component="a"
                href={item.href}
                sx={{
                  color: "#fff",
                  mx: 2,
                  fontWeight: 500,
                  textDecoration: "none",
                  "&:hover": { color: "yellow" },
                  transition: "color 0.2s",
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
