import useDarkMode from "../utils/useDarkMode";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {
  const [theme, setTheme] = useDarkMode();

  return (
    <div className="flex justify-end items-center p-4 bg-white dark:bg-gray-800 shadow">
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="text-gray-800 dark:text-gray-100"
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>
  );
}
