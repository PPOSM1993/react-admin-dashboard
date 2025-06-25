import { useState } from "react";
import { Download, Edit, Trash2 } from "lucide-react";

const mockUsers = [
  { id: 1, name: "Pedro Osorio", email: "pedro@example.com", role: "admin", status: "activo" },
  { id: 2, name: "María Pérez", email: "maria@example.com", role: "soporte", status: "inactivo" },
  { id: 3, name: "Luis González", email: "luis@example.com", role: "técnico", status: "activo" },
  { id: 4, name: "Ana Ramírez", email: "ana@example.com", role: "soporte", status: "activo" },
  { id: 5, name: "Jorge Silva", email: "jorge@example.com", role: "admin", status: "inactivo" },
  { id: 6, name: "Claudia Torres", email: "claudia@example.com", role: "técnico", status: "activo" },
  { id: 7, name: "Tomás Núñez", email: "tomas@example.com", role: "soporte", status: "activo" },
  { id: 8, name: "Sofía Vidal", email: "sofia@example.com", role: "admin", status: "activo" }
];

export default function Users() {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);

  const filtered = mockUsers.filter(u => {
    const matchesName = u.name.toLowerCase().includes(query.toLowerCase());
    const matchesRole = roleFilter === "todos" || u.role === roleFilter;
    return matchesName && matchesRole;
  });

  const totalPages = Math.ceil(filtered.length / usersPerPage);
  const pageUsers = filtered.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const exportToCSV = () => {
    const csv = [
      ["Nombre", "Correo", "Rol", "Estado"],
      ...filtered.map(u => [u.name, u.email, u.role, u.status])
    ]
      .map(row => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "usuarios.csv";
    a.click();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Usuarios</h1>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          <Download size={16} />
          Exportar CSV
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          className="w-full sm:w-1/3 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full sm:w-1/4 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
        >
          <option value="todos">Todos los roles</option>
          <option value="admin">Admin</option>
          <option value="soporte">Soporte</option>
          <option value="técnico">Técnico</option>
        </select>
        <select
          value={usersPerPage}
          onChange={(e) => {
            setUsersPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="w-full sm:w-1/5 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
        >
          <option value={5}>5 por página</option>
          <option value={10}>10 por página</option>
          <option value={20}>20 por página</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <table className="min-w-full text-sm text-left bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs uppercase">
            <tr>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Correo</th>
              <th className="px-6 py-3">Rol</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pageUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No se encontraron usuarios.
                </td>
              </tr>
            ) : (
              pageUsers.map((user, i) => (
                <tr key={user.id} className={i % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}>
                  <td className="px-6 py-4 font-medium">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4 capitalize">{user.role}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === "activo"
                          ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100"
                          : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        <Edit size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación tipo DataTable */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Mostrando {(currentPage - 1) * usersPerPage + 1} a{" "}
          {Math.min(currentPage * usersPerPage, filtered.length)} de {filtered.length} resultados
        </span>

        <div className="inline-flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-md text-sm border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Anterior
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1.5 rounded-md text-sm border ${
                page === currentPage
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-md text-sm border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
