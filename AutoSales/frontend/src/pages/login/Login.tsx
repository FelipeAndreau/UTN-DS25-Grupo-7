import { MdAlternateEmail } from "react-icons/md";
import { FaFingerprint, FaRegEye, FaRegEyeSlash, FaUser, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  
  // Estados para el modal de registro
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [registerData, setRegisterData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [registerError, setRegisterError] = useState<string>("");
  const [registerLoading, setRegisterLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const togglePasswordView = () => setShowPassword(!showPassword);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Usar el backend real
      await authService.login({ email, password });
      login(); // Actualizar el estado de autenticación
      
      // No hacer navegación manual aquí - dejar que App.tsx se encargue
      // del routing automático basado en el rol
    } catch (error: any) {
      console.error('Error de login:', error);
      setError("Email o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterLoading(true);

    // Validaciones
    if (!registerData.nombre || !registerData.email || !registerData.password) {
      setRegisterError("Todos los campos son requeridos");
      setRegisterLoading(false);
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError("Las contraseñas no coinciden");
      setRegisterLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setRegisterError("La contraseña debe tener al menos 6 caracteres");
      setRegisterLoading(false);
      return;
    }

    try {
      // Crear usuario viewer y cliente
      const response = await fetch(`${import.meta.env.VITE_API_PROD_URL || 'http://localhost:3000'}/create-custom-viewer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre: registerData.nombre,
          email: registerData.email,
          password: registerData.password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear la cuenta");
      }

      // Auto-login después del registro exitoso
      try {
        await authService.login({ 
          email: registerData.email, 
          password: registerData.password 
        });
        login();
        setShowRegisterModal(false);
        navigate("/catalogo"); // Los clientes van al catálogo
      } catch (loginError) {
        // Si falla el auto-login, al menos cerramos el modal y mostramos mensaje
        setShowRegisterModal(false);
        setError("Cuenta creada exitosamente. Por favor, inicia sesión.");
      }

    } catch (err) {
      setRegisterError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div
      className="w-full h-screen flex items-center justify-center bg-gray-100 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/fondos/wallpaper.png')" }}
    >
      <div className="w-[90%] max-w-sm md:max-w-md lg:max-w-lg p-6 bg-white flex flex-col items-center gap-4 rounded-xl shadow-lg">
        <img src="/images/fondos/logo.png" alt="logo" className="w-16 md:w-20" />
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Welcome Back</h1>
        <p className="text-sm md:text-base text-gray-500 text-center">
          ¿No tienes una cuenta?{" "}
          <span 
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => setShowRegisterModal(true)}
          >
            Regístrate aquí
          </span>
        </p>

        <form className="w-full flex flex-col gap-4" onSubmit={handleLogin}>
          <div className="w-full flex items-center gap-3 bg-gray-100 p-3 rounded-lg">
            <MdAlternateEmail className="text-gray-500" />
            <input
              type="email"
              placeholder="admin@test.com"
              className="bg-transparent border-0 w-full outline-none text-sm md:text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="w-full flex items-center gap-3 bg-gray-100 p-3 rounded-lg relative">
            <FaFingerprint className="text-gray-500" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="admin123"
              className="bg-transparent border-0 w-full outline-none text-sm md:text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {showPassword ? (
              <FaRegEyeSlash
                className="absolute right-4 text-gray-500 cursor-pointer"
                onClick={togglePasswordView}
              />
            ) : (
              <FaRegEye
                className="absolute right-4 text-gray-500 cursor-pointer"
                onClick={togglePasswordView}
              />
            )}
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Iniciando sesión..." : "Login"}
          </button>
        </form>
      </div>

      {/* Modal de Registro */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-[90%] max-w-md relative max-h-screen overflow-y-auto">
            <button
              onClick={() => setShowRegisterModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="text-xl" />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Crear Cuenta</h2>
              <p className="text-gray-600">Únete a AutoSales como cliente</p>
            </div>

            {registerError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {registerError}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="w-full flex items-center gap-3 bg-gray-100 p-3 rounded-lg">
                <FaUser className="text-gray-500" />
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre completo"
                  value={registerData.nombre}
                  onChange={handleRegisterInputChange}
                  className="bg-transparent border-0 w-full outline-none text-sm"
                  required
                />
              </div>

              <div className="w-full flex items-center gap-3 bg-gray-100 p-3 rounded-lg">
                <MdAlternateEmail className="text-gray-500" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={registerData.email}
                  onChange={handleRegisterInputChange}
                  className="bg-transparent border-0 w-full outline-none text-sm"
                  required
                />
              </div>

              <div className="w-full flex items-center gap-3 bg-gray-100 p-3 rounded-lg">
                <FaFingerprint className="text-gray-500" />
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  value={registerData.password}
                  onChange={handleRegisterInputChange}
                  className="bg-transparent border-0 w-full outline-none text-sm"
                  required
                />
              </div>

              <div className="w-full flex items-center gap-3 bg-gray-100 p-3 rounded-lg">
                <FaFingerprint className="text-gray-500" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirmar contraseña"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterInputChange}
                  className="bg-transparent border-0 w-full outline-none text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={registerLoading}
                className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {registerLoading ? "Creando cuenta..." : "Crear Cuenta"}
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm">
                Al registrarte, aceptas nuestros términos y condiciones
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;