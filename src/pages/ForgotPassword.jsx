import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import logo from '../assets/logo.png';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Ingresa un correo válido");
      return;
    }
    setError("");
    // Aquí iría la llamada real a API para reset password
    setMessage("Se envió un enlace para restablecer la contraseña");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 px-4 transition-colors">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl space-y-6 relative"
      >
        {/* Botón darkMode */}
        <button
          type="button"
          onClick={toggleTheme}
          className="absolute top-4 right-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          aria-label="Toggle dark mode"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Logo y título */}
        <div className="text-center">
          <img src={logo} alt="Logo" className="h-25 w-30 mx-auto mb-2" />
          <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white">
            Restablecer contraseña
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Ingresa tu correo para enviar un enlace de restablecimiento
          </p>
        </div>

        {/* Input email */}
        <div>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          {message && <p className="text-green-600 text-xs mt-1">{message}</p>}
        </div>

        {/* Botones */}
        <div className="flex justify-between items-center text-sm">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Volver al inicio de sesión
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Enviar enlace
          </button>
        </div>
      </form>
    </div>
  );
}
