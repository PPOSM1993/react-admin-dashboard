const users = [
  { name: "Pedro Osorio", email: "pedro@example.com", role: "admin" },
  { name: "Lucía Torres", email: "lucia@example.com", role: "soporte" },
  { name: "Carlos Rojas", email: "carlos@example.com", role: "técnico" },
];

const roleColors = {
  admin: "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100",
  soporte: "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100",
  técnico: "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100",
};

export default function RecentUsersTable() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md overflow-x-auto">
      <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
        Usuarios recientes
      </h2>
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="text-gray-600 dark:text-gray-400 border-b border-gray-300 dark:border-gray-700">
            <th scope="col" className="py-3 px-6 font-semibold">Nombre</th>
            <th scope="col" className="py-3 px-6 font-semibold">Correo</th>
            <th scope="col" className="py-3 px-6 font-semibold">Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map(({ name, email, role }, i) => (
            <tr
              key={email}
              tabIndex={0}
              className={`border-b border-gray-200 dark:border-gray-700
                ${i % 2 === 0 ? "bg-gray-50 dark:bg-gray-700" : ""}
                hover:bg-indigo-100 dark:hover:bg-indigo-800
                focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              <td className="py-3 px-6 text-gray-900 dark:text-white font-medium whitespace-nowrap">
                {name}
              </td>
              <td className="py-3 px-6 text-gray-700 dark:text-gray-300 break-words max-w-xs">
                {email}
              </td>
              <td className="py-3 px-6">
                <span
                  className={`inline-block px-3 py-1 text-xs font-semibold rounded-full capitalize select-none
                    ${roleColors[role] || "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200"}`}
                >
                  {role}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
