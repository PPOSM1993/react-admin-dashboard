import { Moon, Sun, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useDarkMode from "../utils/useDarkMode";

export default function Header({ open, setOpen, collapsed, setCollapsed }) {
  const [theme, setTheme] = useDarkMode();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Móvil: botón menú */}
      <button
        onClick={() => setOpen(!open)}
        className="sm:hidden p-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition"
      >
        <Menu size={22} />
      </button>

      {/* Escritorio: botón colapsar sidebar */}
      <button
        onClick={() => setCollapsed(prev => !prev)}
        className="hidden sm:flex p-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition"
        title="Colapsar sidebar"
      >
        <span className="text-lg font-bold">{collapsed ? "›" : "‹"}</span>
      </button>

      <h1 className="text-lg sm:text-xl font-semibold flex-1 text-center sm:text-left sm:flex-none">
        Admin Pro
      </h1>

      <div className="flex items-center gap-4">
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="text-sm text-red-500 hover:text-red-600">
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
