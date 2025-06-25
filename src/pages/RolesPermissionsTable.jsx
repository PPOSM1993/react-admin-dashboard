import { useState, useMemo, useEffect, useRef } from "react";
import {
  ShieldCheck,
  Eye,
  Pencil,
  Trash2,
  Download,
  X,
  ArrowUpDown,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const allPermissions = [
  "manage_users",
  "edit_roles",
  "view_reports",
  "view_tickets",
  "respond_tickets",
  "view_work_orders",
  "update_status",
];

// Datos iniciales simulados
const initialRoles = [
  {
    name: "admin",
    permissions: ["manage_users", "edit_roles", "view_reports"],
  },
  {
    name: "soporte",
    permissions: ["view_tickets", "respond_tickets"],
  },
  {
    name: "técnico",
    permissions: ["view_work_orders", "update_status"],
  },
];

export default function RolesPermissionsTable() {
  const [roles, setRoles] = useState(initialRoles);
  const [search, setSearch] = useState("");
  const [permissionFilter, setPermissionFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modales
  const [modalRoleView, setModalRoleView] = useState(null);
  const [modalRoleEdit, setModalRoleEdit] = useState(null);
  const [modalRoleDelete, setModalRoleDelete] = useState(null);

  const [editName, setEditName] = useState("");
  const [editPermissions, setEditPermissions] = useState([]);
  const [editErrors, setEditErrors] = useState({});

  const modalEditRef = useRef(null);
  const modalDeleteRef = useRef(null);
  const modalViewRef = useRef(null);

  // --- Filtrado, búsqueda y orden ---
  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      const matchesSearch = role.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesPerm =
        permissionFilter === "" ||
        role.permissions.some((p) =>
          p.toLowerCase().includes(permissionFilter.toLowerCase())
        );
      return matchesSearch && matchesPerm;
    });
  }, [roles, search, permissionFilter]);

  const sortedRoles = useMemo(() => {
    return [...filteredRoles].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredRoles, sortBy, sortDirection]);

  const totalPages = Math.ceil(sortedRoles.length / pageSize);
  const paginatedRoles = sortedRoles.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Validaciones edición
  const validateEdit = () => {
    const errors = {};
    if (!editName.trim()) errors.name = "Role name cannot be empty";
    if (
      roles.some(
        (r) =>
          r.name.toLowerCase() === editName.trim().toLowerCase() &&
          r.name !== modalRoleEdit.name
      )
    )
      errors.name = "Role name already exists";
    return errors;
  };

  // Guardar edición (aquí simula actualización local)
  const saveEdit = () => {
    const errors = validateEdit();
    setEditErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setRoles((prev) =>
      prev.map((r) =>
        r.name === modalRoleEdit.name
          ? { name: editName.trim(), permissions: editPermissions }
          : r
      )
    );
    setModalRoleEdit(null);
  };

  // Toggle permisos edición
  const togglePermission = (perm) => {
    setEditPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  // Confirmar eliminar (simula eliminar local)
  const confirmDelete = () => {
    setRoles((prev) => prev.filter((r) => r.name !== modalRoleDelete.name));
    setModalRoleDelete(null);
  };

  // Limpiar filtros
  const clearFilters = () => {
    setSearch("");
    setPermissionFilter("");
  };

  // Exportar CSV
  const exportToCSV = () => {
    const csvContent = [
      ["Role", "Permissions"],
      ...filteredRoles.map((role) => [role.name, role.permissions.join("; ")]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "roles.csv";
    link.click();
  };

  // Accessibility: trap focus y cerrar con ESC
  useEffect(() => {
    function trapFocus(e) {
      if (!modalRoleEdit && !modalRoleDelete && !modalRoleView) return;

      const modalEl =
        modalRoleEdit
          ? modalEditRef.current
          : modalRoleDelete
            ? modalDeleteRef.current
            : modalViewRef.current;

      if (!modalEl) return;

      const focusableElements = modalEl.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length === 0) return;

      const firstEl = focusableElements[0];
      const lastEl = focusableElements[focusableElements.length - 1];

      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      } else if (e.key === "Escape") {
        if (modalRoleEdit) setModalRoleEdit(null);
        if (modalRoleDelete) setModalRoleDelete(null);
        if (modalRoleView) setModalRoleView(null);
      }
    }
    window.addEventListener("keydown", trapFocus);
    return () => window.removeEventListener("keydown", trapFocus);
  }, [modalRoleEdit, modalRoleDelete, modalRoleView]);

  // Focus automático al abrir modal
  useEffect(() => {
    if (modalRoleEdit && modalEditRef.current) {
      const firstInput = modalEditRef.current.querySelector(
        "input,select,textarea,button"
      );
      firstInput?.focus();
    }
    if (modalRoleDelete && modalDeleteRef.current) {
      const firstBtn = modalDeleteRef.current.querySelector("button");
      firstBtn?.focus();
    }
    if (modalRoleView && modalViewRef.current) {
      const closeBtn = modalViewRef.current.querySelector("button");
      closeBtn?.focus();
    }
  }, [modalRoleEdit, modalRoleDelete, modalRoleView]);

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
        {/* Header y filtros */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <ShieldCheck size={22} /> Roles & Permissions
          </h2>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-red-400 text-red-900 hover:bg-red-500 transition text-sm"
            >
              <X size={16} /> Clear filters
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-indigo-400 text-indigo-900 hover:bg-idigo-500 transition text-sm"
            >
              <Download size={16} /> Export CSV
            </button>

            <button

              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-green-400 text-green-900 hover:bg-green-500 transition text-sm"
            >
              <Plus size={16} />
              New Role
            </button>
          </div>
        </div>

        {/* Filtros de búsqueda y paginación */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by role name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
          />

          <input
            type="text"
            placeholder="Filter by permission..."
            value={permissionFilter}
            onChange={(e) => setPermissionFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
          />

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
          >
            {[10, 25, 50].map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase tracking-wide">
              <tr>
                <th
                  className="py-3 px-4 cursor-pointer select-none"
                  onClick={() => {
                    if (sortBy === "name") {
                      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                    } else {
                      setSortBy("name");
                      setSortDirection("asc");
                    }
                  }}
                >
                  <div className="flex items-center gap-1">
                    Role Name
                    <ArrowUpDown size={14} className="text-gray-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Permissions</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {paginatedRoles.map((role, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="py-3 px-4 font-medium text-gray-800 dark:text-white capitalize">
                    {role.name}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    <ul className="list-disc list-inside space-y-1">
                      {role.permissions.map((perm, pIdx) => (
                        <li key={pIdx} className="text-xs">
                          {perm}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-3 px-4 flex gap-3">
                    <button
                      onClick={() => setModalRoleView(role)}
                      className="flex items-center gap-1 px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                      title="View role details"
                    >
                      <Eye size={16} />
                      View
                    </button>
                    <button
                      onClick={() => {
                        setModalRoleEdit(role);
                        setEditName(role.name);
                        setEditPermissions(role.permissions);
                        setEditErrors({});
                      }}
                      className="flex items-center gap-1 px-3 py-2 rounded-md bg-yellow-400 text-yellow-900 hover:bg-yellow-500 transition"
                      title="Edit role"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => setModalRoleDelete(role)}
                      className="flex items-center gap-1 px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                      title="Delete role"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedRoles.length === 0 && (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center py-6 text-gray-500 dark:text-gray-400"
                  >
                    No roles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex items-center justify-between mt-6 text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal Ver Detalles */}
      <AnimatePresence>
        {modalRoleView && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalRoleView(null)}
          >
            <motion.div
              ref={modalViewRef}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-md w-full p-6 relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modalViewTitle"
            >
              <button
                onClick={() => setModalRoleView(null)}
                className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-red-600"
                title="Close"
              >
                <X size={24} />
              </button>
              <h3
                id="modalViewTitle"
                className="text-xl font-semibold mb-4 dark:text-white capitalize"
              >
                Role: {modalRoleView.name}
              </h3>
              <div>
                <h4 className="font-medium mb-2 dark:text-gray-300">
                  Permissions:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 text-sm max-h-48 overflow-auto">
                  {modalRoleView.permissions.map((perm, i) => (
                    <li key={i}>{perm}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Editar */}
      <AnimatePresence>
        {modalRoleEdit && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalRoleEdit(null)}
          >
            <motion.div
              ref={modalEditRef}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-md w-full p-6 relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modalEditTitle"
            >
              <button
                onClick={() => setModalRoleEdit(null)}
                className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-red-600"
                title="Close"
              >
                <X size={24} />
              </button>
              <h3
                id="modalEditTitle"
                className="text-xl font-semibold mb-4 dark:text-white"
              >
                Edit Role
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveEdit();
                }}
                className="flex flex-col gap-4"
              >
                <div>
                  <label className="block mb-1 font-medium dark:text-gray-300">
                    Role Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white ${editErrors.name ? "border-red-600" : "border-gray-300"
                      }`}
                    aria-invalid={!!editErrors.name}
                    aria-describedby="name-error"
                  />
                  {editErrors.name && (
                    <p
                      id="name-error"
                      className="mt-1 text-red-600 text-sm"
                      role="alert"
                    >
                      {editErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-1 font-medium dark:text-gray-300">
                    Permissions
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-2 bg-gray-50 dark:bg-gray-800">
                    {allPermissions.map((perm) => (
                      <label
                        key={perm}
                        className="inline-flex items-center gap-2 text-sm cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={editPermissions.includes(perm)}
                          onChange={() => togglePermission(perm)}
                          className="cursor-pointer"
                        />
                        {perm}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalRoleEdit(null)}
                    className="px-4 py-2 rounded-md bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
                  >
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Eliminar */}
      <AnimatePresence>
        {modalRoleDelete && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalRoleDelete(null)}
          >
            <motion.div
              ref={modalDeleteRef}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-md w-full p-6 relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modalDeleteTitle"
            >
              <button
                onClick={() => setModalRoleDelete(null)}
                className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-red-600"
                title="Close"
              >
                <X size={24} />
              </button>
              <h3
                id="modalDeleteTitle"
                className="text-xl font-semibold mb-4 dark:text-white capitalize"
              >
                Confirm Delete
              </h3>
              <p className="mb-6 dark:text-gray-300">
                Are you sure you want to delete the role{" "}
                <strong className="capitalize">{modalRoleDelete.name}</strong>?
                This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setModalRoleDelete(null)}
                  className="px-4 py-2 rounded-md bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
