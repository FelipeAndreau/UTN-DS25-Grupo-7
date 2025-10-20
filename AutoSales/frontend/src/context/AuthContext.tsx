import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  rol: string;
  nombre: string;
  email?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Verificar si hay un token válido al iniciar
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    console.log('AuthContext: Checking initial auth state', { token: !!token, userStr: !!userStr });
    
    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        console.log('AuthContext: Setting user data', userData);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        logout();
      }
    } else {
      console.log('AuthContext: No valid token or user data found');
    }
    
    setIsLoading(false);
  }, []);

  const login = () => {
    const userStr = localStorage.getItem('user');
    console.log('AuthContext: login() called, userStr:', !!userStr);
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        console.log('AuthContext: Setting authenticated user', userData);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};