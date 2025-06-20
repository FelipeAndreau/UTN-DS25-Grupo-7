import corollaImg from '../images/corolla.png';
import peugeot208Img from '../images/peugeot208.png';
import sanderoImg from '../images/sandero.png';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';

const autos = [
  {
    nombre: 'Toyota Corolla',
    img: corollaImg,
    descripcion: 'Sedán, 2023, Automático',
  },
  {
    nombre: 'Peugeot 208',
    img: peugeot208Img,
    descripcion: 'Hatchback, 2023, Manual',
  },
  {
    nombre: 'Renault Sandero',
    img: sanderoImg,
    descripcion: 'Hatchback, 2024, Automático',
  },
  // AGREGAR ALGUN AUTO MAS
];

export default function DashboardUser() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6fa', p: 4 }}>
      <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
        Bienvenido a AutoSales
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={4}>
        Descubrí nuestros vehículos disponibles
      </Typography>
      <Grid container spacing={4}>
        {autos.map((auto, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardMedia
                component="img"
                height="180"
                image={auto.img}
                alt={auto.nombre}
                sx={{ objectFit: 'contain', bgcolor: '#fafafa' }}
              />
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {auto.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {auto.descripcion}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="medium"
                  variant="contained"
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: 2,
                    boxShadow: 2,
                    px: 3,
                    py: 1,
                    textTransform: 'none',
                    transition: 'background 0.3s',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      color: 'white',
                    },
                  }}
                  fullWidth
                  disableElevation
                >
                  Ver detalles
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}