export default function Settings() {
  const handleLogout = () => {
    localStorage.removeItem("auth");
    window.location.href = "/login";
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded shadow text-gray-900 dark:text-white">
      <h2 className="text-2xl font-bold mb-4">Configuración</h2>
      <p className="mb-2">Nombre: Pedro Osorio (mock)</p>
      <p className="mb-2">Rol: Administrador</p>
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
