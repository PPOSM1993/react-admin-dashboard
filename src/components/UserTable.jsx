
import { useState } from "react";
import { CheckCircle, XCircle, Users, Mail } from "lucide-react";

export default function UserTable({ users = [] }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos");

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "todos" || user.role === roleFilter;
    const matchesStatus = statusFilter === "todos" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Users size={22} /> Lista de Usuarios
        </h2>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
          />
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
          >
            <option value="todos">Todos los roles</option>
            <option value="admin">Admin</option>
            <option value="soporte">Soporte</option>
            <option value="técnico">Técnico</option>
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
          >
            <option value="todos">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm text-left">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase tracking-wide">
            <tr>
              <th className="py-3 px-4">Nombre</th>
              <th className="py-3 px-4">Correo</th>
              <th className="py-3 px-4">Rol</th>
              <th className="py-3 px-4">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredUsers.map((user, idx) => (
              <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <td className="py-3 px-4 font-medium text-gray-800 dark:text-white">{user.name}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300 flex items-center gap-1">
                  <Mail size={14} className="text-blue-500" />
                  {user.email}
                </td>
                <td className="py-3 px-4 capitalize text-indigo-600 dark:text-indigo-400">{user.role}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium \${user.status === "activo"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"}`}>
                    {user.status === "activo" ? (
                      <CheckCircle size={14} />
                    ) : (
                      <XCircle size={14} />
                    )}
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No se encontraron usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}