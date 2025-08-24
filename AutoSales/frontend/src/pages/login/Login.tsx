import { MdAlternateEmail } from "react-icons/md";
import { FaFingerprint, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
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
      navigate("/dashboard");
    } catch (error: any) {
      console.error('Error de login:', error);
      
      // Fallback a credenciales locales si el backend no está disponible
      const adminEmail = "admin@example.com";
      const adminPassword = "admin123";
      const userEmail = "user@example.com";
      const userPassword = "user123";

      if (email === adminEmail && password === adminPassword) {
        // Simular token para el fallback
        localStorage.setItem('token', 'fallback-admin-token');
        login();
        navigate("/dashboard");
      } else if (email === userEmail && password === userPassword) {
        localStorage.setItem('token', 'fallback-user-token');
        login();
        navigate("/usuario");
      } else {
        setError("Invalid email or password");
      }
    } finally {
      setLoading(false);
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
          Don't have an account?{" "}
          <span className="text-blue-500 cursor-pointer">Sign up</span>
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
    </div>
  );
};

export default Login;