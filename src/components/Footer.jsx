import { Link } from "react-router-dom";
import {
  Github,
  Linkedin,
  Mail,
  Twitter,
  Instagram,
  Globe,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-8 text-sm text-gray-600 dark:text-gray-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-center sm:text-left">
        {/* Branding */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Admin Pro</h2>
          <p className="text-sm mt-1">Plataforma de gestión integral para empresas modernas.</p>
        </div>

        {/* Navegación */}
        <div className="flex justify-center sm:justify-center gap-6">
          <Link to="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
            Contacto
          </Link>
          <Link to="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
            Privacidad
          </Link>
          <Link to="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
            Términos
          </Link>
        </div>

        {/* Redes sociales */}
        <div className="flex justify-center sm:justify-end gap-4">
          <a href="https://github.com/pedroosorio" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
            <Github size={20} />
          </a>
          <a href="https://linkedin.com/in/pedroosorio" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
            <Linkedin size={20} />
          </a>
          <a href="mailto:pedro@example.com" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
            <Mail size={20} />
          </a>
          <a href="https://twitter.com/pedroosorio" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
            <Twitter size={20} />
          </a>
          <a href="https://instagram.com/pedroosorio" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
            <Instagram size={20} />
          </a>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="mt-6 border-t pt-4 border-gray-200 dark:border-gray-700 text-xs text-center text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} Pedro Osorio. Todos los derechos reservados.
      </div>
    </footer>
  );
}
