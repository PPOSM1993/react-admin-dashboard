import { useState, useMemo, useEffect } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  Plus,
  Users,
  ArrowUpDown,
} from "lucide-react";

const initialWorkers = [
  {
    id: 1,
    full_name: "Pedro Osorio",
    email: "pedro@empresa.cl",
    role: "Administrador",
    status: "activo"
  },
  {
    id: 2,
    full_name: "María López",
    email: "maria@empresa.cl",
    role: "Técnico",
    status: "activo"
  },
  {
    id: 3,
    full_name: "Carlos Ruiz",
    email: "carlos@empresa.cl",
    role: "Vendedor",
    status: "inactivo"
  }
];

const roles = ["Administrador", "Técnico", "Vendedor", "Soporte"];
const statusColors = {
  activo: "text-green-600",
  inactivo: "text-red-600"
};

export default function Workers() {
  const [workers, setWorkers] = useState(initialWorkers);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("full_name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [modalView, setModalView] = useState(null);
  const [modalEdit, setModalEdit] = useState(null);
  const [modalDelete, setModalDelete] = useState(null);
  const [modalCreate, setModalCreate] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    role: "",
    status: "activo"
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterRole, filterStatus]);

  const filteredWorkers = useMemo(() => {
    return workers.filter(w =>
      w.full_name.toLowerCase().includes(search.toLowerCase()) &&
      (filterRole ? w.role === filterRole : true) &&
      (filterStatus ? w.status === filterStatus : true)
    );
  }, [workers, search, filterRole, filterStatus]);

  const sortedWorkers = useMemo(() => {
    return [...filteredWorkers].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredWorkers, sortBy, sortDirection]);

  const totalPages = Math.ceil(sortedWorkers.length / itemsPerPage);
  const paginatedWorkers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedWorkers.slice(start, start + itemsPerPage);
  }, [sortedWorkers, currentPage]);

  const validateForm = () => {
    const errs = {};
    if (!form.full_name.trim()) errs.full_name = "Nombre obligatorio";
    if (!form.email.trim()) errs.email = "Email obligatorio";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Email inválido";
    if (!form.role) errs.role = "Rol obligatorio";
    if (!["activo", "inactivo"].includes(form.status)) errs.status = "Estado inválido";
    return errs;
  };

  const handleCreate = () => {
    const errs = validateForm();
    if (Object.keys(errs).length > 0) return setErrors(errs);
    const newWorker = { ...form, id: Date.now() };
    setWorkers([...workers, newWorker]);
    setModalCreate(false);
    setForm({ full_name: "", email: "", role: "", status: "activo" });
    setErrors({});
  };

  const handleUpdate = () => {
    const errs = validateForm();
    if (Object.keys(errs).length > 0) return setErrors(errs);
    setWorkers(workers.map(w => w.id === modalEdit.id ? { ...modalEdit, ...form } : w));
    setModalEdit(null);
    setForm({ full_name: "", email: "", role: "", status: "activo" });
    setErrors({});
  };

  const handleDelete = () => {
    setWorkers(workers.filter(w => w.id !== modalDelete.id));
    setModalDelete(null);
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white";

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Users size={22} /> Trabajadores
        </h2>
        <button
          onClick={() => {
            setModalCreate(true);
            setForm({ full_name: "", email: "", role: "", status: "activo" });
            setErrors({});
          }}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg px-3 py-1.5 text-sm"
        >
          <Plus size={16} /> Agregar
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={inputClass}
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className={inputClass}
        >
          <option value="">Todos los roles</option>
          {roles.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={inputClass}
        >
          <option value="">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
            <tr>
              <th className="py-3 px-4 cursor-pointer" onClick={() => {
                setSortBy("full_name");
                setSortDirection(sortDirection === "asc" ? "desc" : "asc");
              }}>
                <div className="flex items-center gap-1">Nombre <ArrowUpDown size={14} /></div>
              </th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Rol</th>
              <th className="py-3 px-4">Estado</th>
              <th className="py-3 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedWorkers.map(worker => (
              <tr key={worker.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="py-4 px-4 text-gray-800 dark:text-white">{worker.full_name}</td>
                <td className="py-4 px-4 text-gray-600 dark:text-gray-300">{worker.email}</td>
                <td className="py-4 px-4">{worker.role}</td>
                <td className="py-4 px-4">
                  <span className={`font-medium ${statusColors[worker.status]}`}>
                    {worker.status}
                  </span>
                </td>
                <td className="py-4 px-4 flex gap-2 flex-wrap">
                  <button onClick={() => setModalView(worker)} className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center gap-1">
                    <Eye size={16} /> Ver
                  </button>
                  <button onClick={() => {
                    setModalEdit(worker);
                    setForm(worker);
                    setErrors({});
                  }} className="px-3 py-1.5 bg-yellow-400 text-black rounded hover:bg-yellow-500 text-sm flex items-center gap-1">
                    <Pencil size={16} /> Editar
                  </button>
                  <button onClick={() => setModalDelete(worker)} className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 text-sm flex items-center gap-1">
                    <Trash2 size={16} /> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600 dark:text-gray-300">
        <span>Página {currentPage} de {totalPages}</span>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Modales */}
      {(modalCreate || modalEdit) && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-md shadow-lg transform transition-all duration-300 scale-95 opacity-0 animate-fade-in">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
              {modalCreate ? "Nuevo Trabajador" : `Editar ${modalEdit.full_name}`}
            </h3>
            <div className="space-y-3">
              <input
                value={form.full_name}
                onChange={e => setForm({ ...form, full_name: e.target.value })}
                placeholder="Nombre completo"
                className={inputClass}
              />
              {errors.full_name && <p className="text-red-500 text-xs">{errors.full_name}</p>}
              <input
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="Correo electrónico"
                className={inputClass}
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              <select
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
                className={inputClass}
              >
                <option value="">Seleccionar rol</option>
                {roles.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              {errors.role && <p className="text-red-500 text-xs">{errors.role}</p>}
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                className={inputClass}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
              {errors.status && <p className="text-red-500 text-xs">{errors.status}</p>}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setModalCreate(false);
                  setModalEdit(null);
                  setErrors({});
                }}
                className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={modalCreate ? handleCreate : handleUpdate}
                className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {modalView && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-md shadow-lg transform transition-all duration-300 scale-95 opacity-0 animate-fade-in">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
              Información del Trabajador
            </h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li><strong>Nombre:</strong> {modalView.full_name}</li>
              <li><strong>Email:</strong> {modalView.email}</li>
              <li><strong>Rol:</strong> {modalView.role}</li>
              <li><strong>Estado:</strong> {modalView.status}</li>
            </ul>
            <div className="mt-6 text-right">
              <button
                onClick={() => setModalView(null)}
                className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-400"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {modalDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-md shadow-lg transform transition-all duration-300 scale-95 opacity-0 animate-fade-in">
            <h3 className="text-lg font-bold text-red-600 mb-4">¿Eliminar trabajador?</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              Estás por eliminar <strong>{modalDelete.full_name}</strong>.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalDelete(null)}
                className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
