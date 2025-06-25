import { useState, useMemo, useEffect, useRef } from "react";
import {
  ShieldCheck,
  Eye,
  Pencil,
  Trash2,
  Download,
  X,
  ArrowUpDown,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Datos iniciales simulados de usuarios
const initialUsers = [
  {
    id: 1,
    name: "Pedro Osorio",
    email: "pedro@example.com",
    role: "admin",
  },
  {
    id: 2,
    name: "Lucía Torres",
    email: "lucia@example.com",
    role: "soporte",
  },
  {
    id: 3,
    name: "Carlos Rojas",
    email: "carlos@example.com",
    role: "técnico",
  },
];

// Roles disponibles para filtro y asignación
const allRoles = ["admin", "soporte", "técnico"];

export default function Users() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modales
  const [modalView, setModalView] = useState(null);
  const [modalEdit, setModalEdit] = useState(null);
  const [modalDelete, setModalDelete] = useState(null);
  const [modalCreate, setModalCreate] = useState(false);

  // Form states para edición y creación
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState(allRoles[0]);
  const [formErrors, setFormErrors] = useState({});

  // Refs para manejo accesibilidad modals
  const modalViewRef = useRef(null);
  const modalEditRef = useRef(null);
  const modalDeleteRef = useRef(null);
  const modalCreateRef = useRef(null);

  // --- Filtrado, búsqueda y orden ---
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      // Para strings case insensitive
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredUsers, sortBy, sortDirection]);

  const totalPages = Math.ceil(sortedUsers.length / pageSize);
  const paginatedUsers = sortedUsers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Validación simple de formularios
  const validateForm = () => {
    const errors = {};
    if (!formName.trim()) errors.name = "Name is required";
    if (!formEmail.trim()) errors.email = "Email is required";
    else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formEmail.trim())
    )
      errors.email = "Invalid email address";
    if (!formRole) errors.role = "Role is required";

    // Validar email único para creación y edición
    const emailExists = users.some(
      (u) =>
        u.email.toLowerCase() === formEmail.trim().toLowerCase() &&
        (modalEdit ? u.id !== modalEdit.id : true)
    );
    if (emailExists) errors.email = "Email already exists";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Guardar nuevo usuario
  const saveCreate = () => {
    if (!validateForm()) return;
    const newUser = {
      id: Math.max(...users.map((u) => u.id)) + 1,
      name: formName.trim(),
      email: formEmail.trim(),
      role: formRole,
    };
    setUsers((prev) => [newUser, ...prev]);
    setModalCreate(false);
  };

  // Guardar edición usuario
  const saveEdit = () => {
    if (!validateForm()) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === modalEdit.id
          ? { ...u, name: formName.trim(), email: formEmail.trim(), role: formRole }
          : u
      )
    );
    setModalEdit(null);
  };

  // Confirmar eliminar usuario
  const confirmDelete = () => {
    setUsers((prev) => prev.filter((u) => u.id !== modalDelete.id));
    setModalDelete(null);
  };

  // Abrir modal creación con formulario limpio
  const openCreateModal = () => {
    setFormName("");
    setFormEmail("");
    setFormRole(allRoles[0]);
    setFormErrors({});
    setModalCreate(true);
  };

  // Abrir modal edición con datos cargados
  const openEditModal = (user) => {
    setFormName(user.name);
    setFormEmail(user.email);
    setFormRole(user.role);
    setFormErrors({});
    setModalEdit(user);
  };

  // Accessibility trap focus y cerrar con ESC en modales
  useEffect(() => {
    function trapFocus(e) {
      if (!modalEdit && !modalDelete && !modalView && !modalCreate) return;

      let modalEl =
        modalEdit
          ? modalEditRef.current
          : modalDelete
            ? modalDeleteRef.current
            : modalView
              ? modalViewRef.current
              : modalCreateRef.current;

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
        if (modalEdit) setModalEdit(null);
        if (modalDelete) setModalDelete(null);
        if (modalView) setModalView(null);
        if (modalCreate) setModalCreate(false);
      }
    }
    window.addEventListener("keydown", trapFocus);
    return () => window.removeEventListener("keydown", trapFocus);
  }, [modalEdit, modalDelete, modalView, modalCreate]);

  // Focus automático al abrir modal
  useEffect(() => {
    if (modalEdit && modalEditRef.current) {
      const firstInput = modalEditRef.current.querySelector(
        "input,select,textarea,button"
      );
      firstInput?.focus();
    }
    if (modalDelete && modalDeleteRef.current) {
      const firstBtn = modalDeleteRef.current.querySelector("button");
      firstBtn?.focus();
    }
    if (modalView && modalViewRef.current) {
      const closeBtn = modalViewRef.current.querySelector("button");
      closeBtn?.focus();
    }
    if (modalCreate && modalCreateRef.current) {
      const firstInput = modalCreateRef.current.querySelector(
        "input,select,textarea,button"
      );
      firstInput?.focus();
    }
  }, [modalEdit, modalDelete, modalView, modalCreate]);

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
        {/* Header y filtros */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <ShieldCheck size={22} /> Users
          </h2>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-green-400 text-green-900 hover:bg-green-500 transition text-sm"
          >
            <Plus size={18} />
            Create User
          </button>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
          >
            <option value="">All roles</option>
            {allRoles.map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
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
        {/* Tabla */}
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full table-auto text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase tracking-wide text-xs">
              <tr>
                <th
                  className="py-4 px-3 cursor-pointer select-none"
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
                    Name
                    <ArrowUpDown size={12} className="text-gray-400" />
                  </div>
                </th>
                <th
                  className="py-4 px-3 cursor-pointer select-none"
                  onClick={() => {
                    if (sortBy === "email") {
                      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                    } else {
                      setSortBy("email");
                      setSortDirection("asc");
                    }
                  }}
                >
                  <div className="flex items-center gap-1">
                    Email
                    <ArrowUpDown size={12} className="text-gray-400" />
                  </div>
                </th>
                <th
                  className="py-4 px-3 cursor-pointer select-none"
                  onClick={() => {
                    if (sortBy === "role") {
                      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                    } else {
                      setSortBy("role");
                      setSortDirection("asc");
                    }
                  }}
                >
                  <div className="flex items-center gap-1">
                    Role
                    <ArrowUpDown size={12} className="text-gray-400" />
                  </div>
                </th>
                <th className="py-4 px-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="py-5 px-5 font-medium text-gray-800 dark:text-white capitalize">
                    {user.name}
                  </td>
                  <td className="py-5 px-5 font-medium text-gray-800 dark:text-white">
                    {user.email}
                  </td>
                  <td className="py-5 px-5 capitalize text-gray-700 dark:text-gray-300">
                    {user.role}
                  </td>
                  <td className="py-3 px-3 flex gap-2">
                    <button
                      onClick={() => setModalView(user)}
                      className="flex items-center gap-1 px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition text-sm"
                      title="View user details"
                    >
                      <Eye size={14} />
                      View
                    </button>
                    <button
                      onClick={() => openEditModal(user)}
                      className="flex items-center gap-1 px-3 py-2 rounded-md bg-yellow-400 text-yellow-900 hover:bg-yellow-500 transition text-sm"
                      title="Edit user"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => setModalDelete(user)}
                      className="flex items-center gap-1 px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition text-sm"
                      title="Delete user"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedUsers.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-6 text-gray-500 dark:text-gray-400"
                  >
                    No users found.
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
        {modalView && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalView(null)}
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
                onClick={() => setModalView(null)}
                className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-red-600"
                title="Close"
              >
                <X size={24} />
              </button>
              <h3
                id="modalViewTitle"
                className="text-xl font-semibold mb-4 dark:text-white"
              >
                User: {modalView.name}
              </h3>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p>
                  <strong>Email:</strong> {modalView.email}
                </p>
                <p>
                  <strong>Role:</strong> {modalView.role}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Crear */}
      <AnimatePresence>
        {modalCreate && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalCreate(false)}
          >
            <motion.div
              ref={modalCreateRef}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-md w-full p-6 relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modalCreateTitle"
            >
              <button
                onClick={() => setModalCreate(false)}
                className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-red-600"
                title="Close"
              >
                <X size={24} />
              </button>
              <h3
                id="modalCreateTitle"
                className="text-xl font-semibold mb-4 dark:text-white"
              >
                Create User
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveCreate();
                }}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-md text-base bg-white dark:bg-gray-800 text-gray-800 dark:text-white ${formErrors.name ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-md text-base bg-white dark:bg-gray-800 text-gray-800 dark:text-white ${formErrors.email ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="role"
                    className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
                  >
                    Role
                  </label>
                  <select
                    id="role"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-md text-base bg-white dark:bg-gray-800 text-gray-800 dark:text-white ${formErrors.role ? "border-red-500" : "border-gray-300"
                      }`}
                  >
                    {allRoles.map((role) => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </select>
                  {formErrors.role && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.role}</p>
                  )}
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalCreate(false)}
                    className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition text-base"
                  >
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Editar */}
      <AnimatePresence>
        {modalEdit && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalEdit(null)}
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
                onClick={() => setModalEdit(null)}
                className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-red-600"
                title="Close"
              >
                <X size={24} />
              </button>
              <h3
                id="modalEditTitle"
                className="text-xl font-semibold mb-4 dark:text-white"
              >
                Edit User
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveEdit();
                }}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="edit-name"
                    className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
                  >
                    Name
                  </label>
                  <input
                    id="edit-name"
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-md text-base bg-white dark:bg-gray-800 text-gray-800 dark:text-white ${formErrors.name ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="edit-email"
                    className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email
                  </label>
                  <input
                    id="edit-email"
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-md text-base bg-white dark:bg-gray-800 text-gray-800 dark:text-white ${formErrors.email ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="edit-role"
                    className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
                  >
                    Role
                  </label>
                  <select
                    id="edit-role"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-md text-base bg-white dark:bg-gray-800 text-gray-800 dark:text-white ${formErrors.role ? "border-red-500" : "border-gray-300"
                      }`}
                  >
                    {allRoles.map((role) => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </select>
                  {formErrors.role && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.role}</p>
                  )}
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalEdit(null)}
                    className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-yellow-400 text-yellow-900 hover:bg-yellow-500 transition text-base"
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
        {modalDelete && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalDelete(null)}
          >
            <motion.div
              ref={modalDeleteRef}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-sm w-full p-6 relative"
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
                onClick={() => setModalDelete(null)}
                className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-red-600"
                title="Close"
              >
                <X size={24} />
              </button>
              <h3
                id="modalDeleteTitle"
                className="text-xl font-semibold mb-4 dark:text-white"
              >
                Delete User
              </h3>
              <p className="mb-6 dark:text-gray-300">
                Are you sure you want to delete <strong>{modalDelete.name}</strong>?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setModalDelete(null)}
                  className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition text-base"
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
