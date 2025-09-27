import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Usuario from "./pages/usuarios/Usuario";
import Catalogo from "./pages/catalogo/Catalogo";
import Registro from "./pages/registro/Registro";
import { AuthProvider, useAuth } from "./context/AuthContext";

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  console.log('AppRoutes: Render', { isAuthenticated, user: user?.rol });

  // Componente para proteger rutas
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    console.log('ProtectedRoute: Checking auth', { isAuthenticated });
    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  };

  // Función para determinar la ruta por defecto según el rol
  const getDefaultRoute = () => {
    if (!user) {
      console.log('getDefaultRoute: No user, going to /');
      return "/";
    }
    
    console.log('getDefaultRoute: User role', user.rol);
    
    // Si es admin, va al dashboard
    if (user.rol === "admin") {
      console.log('getDefaultRoute: Admin user, going to /dashboard');
      return "/dashboard";
    }
    
    // Si es viewer, cliente u otro rol, va al catálogo
    console.log('getDefaultRoute: Non-admin user, going to /catalogo');
    return "/catalogo";
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <Navigate to={getDefaultRoute()} replace />
            ) : (
              <Login />
            )
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              {user?.rol === "admin" ? (
                <Dashboard />
              ) : (
                <Navigate to="/catalogo" replace />
              )}
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/registro" 
          element={
            isAuthenticated ? (
              <Navigate to={getDefaultRoute()} replace />
            ) : (
              <Registro />
            )
          } 
        />
        <Route 
          path="/catalogo" 
          element={
            <ProtectedRoute>
              <Catalogo />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/usuario" 
          element={
            <ProtectedRoute>
              <Usuario />
            </ProtectedRoute>
          } 
        />
        {/* Redireccion para rutas no encontradas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

function App() {
  console.log('App: Rendering full app...');
  
  try {
    return (
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    );
  } catch (error) {
    console.error('Error rendering App:', error);
    return (
      <div style={{ padding: '20px', background: 'red', color: 'white' }}>
        <h1>Error en la aplicación</h1>
        <p>{String(error)}</p>
      </div>
    );
  }
}

export default App;