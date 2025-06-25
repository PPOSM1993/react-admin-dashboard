import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { Moon, Sun } from "lucide-react";
import logo from '../assets/logo.png'

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
    document.documentElement.classList.toggle("dark", storedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };


  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      localStorage.setItem("auth", "true");

      
      navigate("/");
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 px-4 transition-colors">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl space-y-6 relative"
        >
          {/* Botón darkMode */}
          <button
            type="button"
            onClick={toggleTheme}
            className="absolute top-4 right-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Logo y título */}
          <div className="text-center">
            <img src={logo} alt="Logo" className="h-25 w-30 mx-auto mb-2" />

            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white">
              Inicia sesión
            </h2>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Enlace y error */}
          <div className="flex justify-between items-center text-sm">
            <a href="/forgot-password" className="text-blue-600 dark:text-blue-400 hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Botón login */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Iniciar Sesion
          </button>

          {/* Separador */}
          <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
            <div className="h-px bg-gray-300 dark:bg-gray-700 flex-1" />
            o
            <div className="h-px bg-gray-300 dark:bg-gray-700 flex-1" />
          </div>

          {/* Google login */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 border border-gray-300 dark:border-gray-600 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <FcGoogle size={20} />
            <span className="text-gray-700 dark:text-gray-200 font-medium">
              Iniciar con Google
            </span>
          </button>
        </form>
      </div>
    </>
  );
}
