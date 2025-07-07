import { MdAlternateEmail } from "react-icons/md";
import { FaFingerprint, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Aurora from './Aurora';
import StarBorder from './StarBorder.tsx';

const Login = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const togglePasswordView = () => setShowPassword(!showPassword);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Credenciales básicas
    const adminEmail = "admin@example.com";
    const adminPassword = "admin123";
    const userEmail = "user@example.com";
    const userPassword = "user123";

    if (email === adminEmail && password === adminPassword) {
      navigate("/dashboard"); // Redirige al dashboard del administrador
    } else if (email === userEmail && password === userPassword) {
      navigate("/usuario"); // Redirige a la vista del usuario
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Fondo Aurora */}
      <div className="absolute inset-0 -z-10">
        <Aurora
          colorStops={["#3A29FF", "#7cf666", "#3A29FF"]}
          blend={0.8}
          amplitude={1.5}
          speed={0.5}
        />
      </div>
      {/* Contenido del login */}
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
              placeholder="admin@example.com O user@example.com"
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
              placeholder="admin123 O user123"
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

          <StarBorder
            as="button"
            type="submit"
            className="w-full mt-2"
            color="cyan"
            speed="5s"
          >
            Login
          </StarBorder>
        </form>
      </div>
    </div>
  );
};

export default Login;
