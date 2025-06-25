import { useState, useEffect } from "react";
import { LogOut, User, Shield, X } from "lucide-react";

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center space-x-4 py-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-tr from-blue-400 to-blue-600 text-white shadow-md">
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">{label}</p>
        <p className="text-xl font-semibold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

export default function Settings() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    setAnimateOut(false);
  };

  const closeModal = () => {
    // Añadimos animación de salida
    setAnimateOut(true);
    setTimeout(() => setIsModalOpen(false), 300);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    window.location.href = "/login";
  };

  // Bloquear scroll al abrir modal
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isModalOpen]);

  return (
    <>
      <section className="max-w-3xl mx-auto p-10 bg-gradient-to-tr from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-3xl shadow-xl">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-10 tracking-tight">
          Configuración de cuenta
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-inner p-8 space-y-8 border border-gray-200 dark:border-gray-700">
          <InfoItem icon={User} label="Nombre" value="Pedro Osorio (mock)" />
          <InfoItem icon={Shield} label="Rol" value="Administrador" />
          {/* Puedes agregar más campos aquí */}
        </div>

        <div className="mt-12 text-right">
          <button
            onClick={openModal}
            className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-400 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg transition-all duration-300"
            aria-label="Cerrar sesión"
          >
            <LogOut size={22} />
            Cerrar sesión
          </button>
        </div>
      </section>

      {/* Modal con animación */}
      {isModalOpen && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300 ${
            animateOut ? "opacity-0" : "opacity-100"
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={closeModal} // Cerrar al hacer click fuera del modal
        >
          <div
            className={`bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full p-8 relative transform transition-transform duration-300 ${
              animateOut ? "scale-90 opacity-0" : "scale-100 opacity-100"
            }`}
            onClick={(e) => e.stopPropagation()} // Prevenir cierre al click dentro del modal
          >
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              aria-label="Cerrar modal"
            >
              <X size={26} />
            </button>

            <h2
              id="modal-title"
              className="text-3xl font-extrabold mb-6 text-gray-900 dark:text-white leading-tight"
            >
              ¿Estás seguro que quieres cerrar sesión?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Al cerrar sesión, tendrás que iniciar sesión de nuevo para acceder a tu cuenta.
            </p>
            <div className="flex justify-end gap-6">
              <button
                onClick={closeModal}
                className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition-shadow shadow-lg hover:shadow-xl"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
