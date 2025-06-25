import { useState, useMemo, useEffect, useRef } from "react";
import {
  CheckCircle,
  XCircle,
  Users,
  Mail,
  Eye,
  Pencil,
  Trash2,
  X,
  ArrowUpDown,
  Download,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// Simulación de datos por defecto (puedes conectar al backend luego)
const rolesList = ["admin", "soporte", "técnico"];
const defaultPageSizeOptions = [10, 25, 50];

// Usuario ejemplo para poblar
const initialUsers = [
  {
    id: 1,
    name: "Pedro Osorio",
    email: "pedro@example.com",
    role: "admin",
    status: "activo",
  },
  {
    id: 2,
    name: "Lucía Torres",
    email: "lucia@example.com",
    role: "soporte",
    status: "activo",
  },
  {
    id: 3,
    name: "Carlos Rojas",
    email: "carlos@example.com",
    role: "técnico",
    status: "inactivo",
  },
];

export default function UserTable() {
  const [users, setUsers] = useState(initialUsers);

  const [search, setSearch] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [statusFilter, setStatusFilter] = useState("todos");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modales
  const [modalViewUser, setModalViewUser] = useState(null);
  const [modalEditUser, setModalEditUser] = useState(null);
  const [modalDeleteUser, setModalDeleteUser] = useState(null);
  const [modalCreateUser, setModalCreateUser] = useState(false);

  // Formulario (para crear/editar)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: rolesList[0],
    status: "activo",
  });
  const [formErrors, setFormErrors] = useState({});

  // Refs para manejo de foco accesible
  const modalViewRef = useRef(null);
  const modalEditRef = useRef(null);
  const modalDeleteRef = useRef(null);
  const modalCreateRef = useRef(null);

  // Helpers
  const toggleRole = (role) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedRoles([]);
    setStatusFilter("todos");
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ["Nombre", "Correo", "Rol", "Estado"],
      ...filteredUsers.map((user) => [
        user.name,
        user.email,
        user.role,
        user.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "usuarios.csv";
    link.click();
  };

  // Validación formulario simple
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "El nombre es obligatorio.";
    }
    if (!formData.email.trim()) {
      errors.email = "El correo es obligatorio.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email.trim())
    ) {
      errors.email = "El correo no es válido.";
    } else {
      // Validar duplicados al crear o editar
      const emailExists = users.some(
        (u) =>
          u.email.toLowerCase() === formData.email.trim().toLowerCase() &&
          (!modalEditUser || u.id !== modalEditUser.id)
      );
      if (emailExists) {
        errors.email = "El correo ya está en uso.";
      }
    }
    if (!rolesList.includes(formData.role)) {
      errors.role = "Rol inválido.";
    }
    if (!["activo", "inactivo"].includes(formData.status)) {
      errors.status = "Estado inválido.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Filtrado
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole =
        selectedRoles.length === 0 || selectedRoles.includes(user.role);

      const matchesStatus = statusFilter === "todos" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, selectedRoles, statusFilter]);

  // Ordenamiento
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredUsers, sortBy, sortDirection]);

  // Paginación
  const totalPages = Math.ceil(sortedUsers.length / pageSize);
  const paginatedUsers = sortedUsers.slice((page - 1) * pageSize, page * pageSize);

  // Funciones para manejar modales y formularios

  // Abrir modal ver usuario
  const openViewModal = (user) => {
    setModalViewUser(user);
  };

  // Abrir modal editar usuario con datos
  const openEditModal = (user) => {
    setModalEditUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setFormErrors({});
  };

  // Guardar edición
  const saveEdit = () => {
    if (!validateForm()) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === modalEditUser.id ? { ...u, ...formData } : u
      )
    );
    setModalEditUser(null);
  };

  // Abrir modal eliminar
  const openDeleteModal = (user) => {
    setModalDeleteUser(user);
  };

  // Confirmar eliminar
  const confirmDelete = () => {
    setUsers((prev) => prev.filter((u) => u.id !== modalDeleteUser.id));
    setModalDeleteUser(null);
  };

  // Abrir modal crear usuario
  const openCreateModal = () => {
    setFormData({
      name: "",
      email: "",
      role: rolesList[0],
      status: "activo",
    });
    setFormErrors({});
    setModalCreateUser(true);
  };

  // Crear usuario
  const createUser = () => {
    if (!validateForm()) return;
    const newUser = {
      id: users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      ...formData,
    };
    setUsers((prev) => [...prev, newUser]);
    setModalCreateUser(false);
  };

  // Accesibilidad: foco en el modal cuando abre
  useEffect(() => {
    if (modalViewUser && modalViewRef.current) {
      modalViewRef.current.focus();
    }
    if (modalEditUser && modalEditRef.current) {
      modalEditRef.current.focus();
    }
    if (modalDeleteUser && modalDeleteRef.current) {
      modalDeleteRef.current.focus();
    }
    if (modalCreateUser && modalCreateRef.current) {
      modalCreateRef.current.focus();
    }
  }, [modalViewUser, modalEditUser, modalDeleteUser, modalCreateUser]);

  // Cerrar modales con ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setModalViewUser(null);
        setModalEditUser(null);
        setModalDeleteUser(null);
        setModalCreateUser(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Users size={22} /> Usuarios
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
              aria-label="Limpiar filtros"
            >
              <X size={16} /> Limpiar filtros
            </button>
            <button
              onClick={exportToCSV}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              aria-label="Exportar usuarios a CSV"
            >
              <Download size={16} /> Exportar CSV
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            aria-label="Buscar usuarios"
          />

          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtro por roles">
            {rolesList.map((role) => (
              <button
                key={role}
                onClick={() => toggleRole(role)}
                className={`px-4 py-2 rounded-md text-sm border font-semibold ${
                  selectedRoles.includes(role)
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                }`}
                aria-pressed={selectedRoles.includes(role)}
              >
                {role}
              </button>
            ))}
          </div>

          <div
            className="flex gap-2 items-center"
            role="group"
            aria-label="Filtro por estado"
          >
            {["todos", "activo", "inactivo"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-md text-sm border font-semibold capitalize ${
                  statusFilter === status
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                }`}
                aria-pressed={statusFilter === status}
              >
                {status}
              </button>
            ))}
          </div>

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            aria-label="Cantidad de usuarios por página"
          >
            {defaultPageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size} por página
              </option>
            ))}
          </select>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase tracking-wide">
              <tr>
                {["name", "email", "role", "status"].map((field) => (
                  <th
                    key={field}
                    className="py-3 px-4 cursor-pointer select-none"
                    onClick={() => handleSort(field)}
                    scope="col"
                  >
                    <div className="flex items-center gap-1 capitalize">
                      {field === "name"
                        ? "Nombre"
                        : field === "email"
                        ? "Correo"
                        : field === "role"
                        ? "Rol"
                        : "Estado"}
                      <ArrowUpDown size={14} className="text-gray-400" />
                    </div>
                  </th>
                ))}
                <th className="py-3 px-4" scope="col">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {paginatedUsers.map((user, idx) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="py-3 px-4 font-medium text-gray-800 dark:text-white">
                    {user.name}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300 flex items-center gap-1">
                    <Mail size={14} className="text-blue-500" />
                    {user.email}
                  </td>
                  <td className="py-3 px-4 capitalize text-indigo-600 dark:text-indigo-400">
                    {user.role}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === "activo"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {user.status === "activo" ? (
                        <CheckCircle size={14} />
                      ) : (
                        <XCircle size={14} />
                      )}
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex gap-3">
                    <button
                      onClick={() => openViewModal(user)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label={`Ver detalles de ${user.name}`}
                    >
                      <Eye size={16} />
                      Ver
                    </button>
                    <button
                      onClick={() => openEditModal(user)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      aria-label={`Editar ${user.name}`}
                    >
                      <Pencil size={16} />
                      Editar
                    </button>
                    <button
                      onClick={() => openDeleteModal(user)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      aria-label={`Eliminar ${user.name}`}
                    >
                      <Trash2 size={16} />
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedUsers.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-500 dark:text-gray-400"
                  >
                    No se encontraron usuarios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex items-center justify-between mt-6 text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Página {page} de {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>

        {/* Botón Crear usuario */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Crear Usuario
          </button>
        </div>
      </div>

      {/* Modales */}

      <AnimatePresence>
        {/* Modal Ver Usuario */}
        {modalViewUser && (
          <Modal
            onClose={() => setModalViewUser(null)}
            title={`Detalles de ${modalViewUser.name}`}
            ref={modalViewRef}
          >
            <p>
              <strong>Nombre:</strong> {modalViewUser.name}
            </p>
            <p>
              <strong>Correo:</strong> {modalViewUser.email}
            </p>
            <p>
              <strong>Rol:</strong> {modalViewUser.role}
            </p>
            <p>
              <strong>Estado:</strong>{" "}
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  modalViewUser.status === "activo"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                }`}
              >
                {modalViewUser.status === "activo" ? (
                  <CheckCircle size={14} />
                ) : (
                  <XCircle size={14} />
                )}
                {modalViewUser.status}
              </span>
            </p>
            <button
              onClick={() => setModalViewUser(null)}
              className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cerrar
            </button>
          </Modal>
        )}

        {/* Modal Editar Usuario */}
        {modalEditUser && (
          <Modal
            onClose={() => setModalEditUser(null)}
            title={`Editar Usuario: ${modalEditUser.name}`}
            ref={modalEditRef}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveEdit();
              }}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block font-semibold mb-1 text-gray-700 dark:text-gray-300"
                >
                  Nombre
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white ${
                    formErrors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  aria-invalid={!!formErrors.name}
                  aria-describedby="error-name"
                  autoFocus
                />
                {formErrors.name && (
                  <p
                    id="error-name"
                    className="text-red-600 text-sm mt-1"
                    role="alert"
                  >
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block font-semibold mb-1 text-gray-700 dark:text-gray-300"
                >
                  Correo
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white ${
                    formErrors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  aria-invalid={!!formErrors.email}
                  aria-describedby="error-email"
                />
                {formErrors.email && (
                  <p
                    id="error-email"
                    className="text-red-600 text-sm mt-1"
                    role="alert"
                  >
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block font-semibold mb-1 text-gray-700 dark:text-gray-300"
                >
                  Rol
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white ${
                    formErrors.role ? "border-red-500" : "border-gray-300"
                  }`}
                  aria-invalid={!!formErrors.role}
                  aria-describedby="error-role"
                >
                  {rolesList.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                {formErrors.role && (
                  <p
                    id="error-role"
                    className="text-red-600 text-sm mt-1"
                    role="alert"
                  >
                    {formErrors.role}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block font-semibold mb-1 text-gray-700 dark:text-gray-300"
                >
                  Estado
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white ${
                    formErrors.status ? "border-red-500" : "border-gray-300"
                  }`}
                  aria-invalid={!!formErrors.status}
                  aria-describedby="error-status"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
                {formErrors.status && (
                  <p
                    id="error-status"
                    className="text-red-600 text-sm mt-1"
                    role="alert"
                  >
                    {formErrors.status}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setModalEditUser(null)}
                  className="px-4 py-2 rounded-md bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  Guardar
                </button>
              </div>
            </form>
          </Modal>
        )}

        {/* Modal Eliminar Usuario */}
        {modalDeleteUser && (
          <Modal
            onClose={() => setModalDeleteUser(null)}
            title={`Eliminar Usuario: ${modalDeleteUser.name}`}
            ref={modalDeleteRef}
          >
            <p>¿Estás seguro de que quieres eliminar este usuario?</p>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setModalDeleteUser(null)}
                className="px-4 py-2 rounded-md bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Eliminar
              </button>
            </div>
          </Modal>
        )}

        {/* Modal Crear Usuario */}
        {modalCreateUser && (
          <Modal
            onClose={() => setModalCreateUser(false)}
            title="Crear Nuevo Usuario"
            ref={modalCreateRef}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createUser();
              }}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="create-name"
                  className="block font-semibold mb-1 text-gray-700 dark:text-gray-300"
                >
                  Nombre
                </label>
                <input
                  id="create-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white ${
                    formErrors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  aria-invalid={!!formErrors.name}
                  aria-describedby="create-error-name"
                  autoFocus
                />
                {formErrors.name && (
                  <p
                    id="create-error-name"
                    className="text-red-600 text-sm mt-1"
                    role="alert"
                  >
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="create-email"
                  className="block font-semibold mb-1 text-gray-700 dark:text-gray-300"
                >
                  Correo
                </label>
                <input
                  id="create-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white ${
                    formErrors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  aria-invalid={!!formErrors.email}
                  aria-describedby="create-error-email"
                />
                {formErrors.email && (
                  <p
                    id="create-error-email"
                    className="text-red-600 text-sm mt-1"
                    role="alert"
                  >
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="create-role"
                  className="block font-semibold mb-1 text-gray-700 dark:text-gray-300"
                >
                  Rol
                </label>
                <select
                  id="create-role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white ${
                    formErrors.role ? "border-red-500" : "border-gray-300"
                  }`}
                  aria-invalid={!!formErrors.role}
                  aria-describedby="create-error-role"
                >
                  {rolesList.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                {formErrors.role && (
                  <p
                    id="create-error-role"
                    className="text-red-600 text-sm mt-1"
                    role="alert"
                  >
                    {formErrors.role}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="create-status"
                  className="block font-semibold mb-1 text-gray-700 dark:text-gray-300"
                >
                  Estado
                </label>
                <select
                  id="create-status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white ${
                    formErrors.status ? "border-red-500" : "border-gray-300"
                  }`}
                  aria-invalid={!!formErrors.status}
                  aria-describedby="create-error-status"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
                {formErrors.status && (
                  <p
                    id="create-error-status"
                    className="text-red-600 text-sm mt-1"
                    role="alert"
                  >
                    {formErrors.status}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setModalCreateUser(false)}
                  className="px-4 py-2 rounded-md bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Crear
                </button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

// Componente Modal reutilizable con animación suave y estilo
const Modal = React.forwardRef(({ children, onClose, title }, ref) => {
  // Evitar scroll del body cuando modal está abierto
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  // Cerrar al click fuera
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={handleBackgroundClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      tabIndex={-1}
      ref={ref}
    >
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-lg w-full p-6 mx-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <h3
          className="text-xl font-semibold mb-4 text-gray-900 dark:text-white"
          id="modal-title"
        >
          {title}
        </h3>
        {children}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
          aria-label="Cerrar modal"
        >
          <X size={24} />
        </button>
      </motion.div>
    </motion.div>
  );
});
