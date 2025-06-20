import Header from './Header';
import Footer from './Footer';
import { Box } from '@mui/material';

export default function Layout({ children }) {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Box component="main" flexGrow={1} bgcolor="#fff" p={{ xs: 2, md: 8 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
