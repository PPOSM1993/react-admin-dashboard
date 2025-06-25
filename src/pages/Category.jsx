import { useState, useMemo } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  Folder,
  Eye,
  ArrowUpDown,
} from "lucide-react";

const initialCategories = [
  { id: 1, name: "Libros", status: "activo" },
  { id: 2, name: "Tecnología", status: "activo" },
  { id: 3, name: "Cursos", status: "inactivo" },
];

const statusColors = {
  activo: "text-green-600",
  inactivo: "text-red-600",
};

export default function Category() {
  const [categories, setCategories] = useState(initialCategories);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [modalView, setModalView] = useState(null);
  const [modalEdit, setModalEdit] = useState(null);
  const [modalDelete, setModalDelete] = useState(null);
  const [modalCreate, setModalCreate] = useState(false);
  const [form, setForm] = useState({ name: "", status: "activo" });
  const [errors, setErrors] = useState({});

  const filteredCategories = useMemo(() => {
    return categories.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [categories, search]);

  const sortedCategories = useMemo(() => {
    return [...filteredCategories].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredCategories, sortBy, sortDirection]);

  const validateForm = () => {
    const errs = {};
    if (!form.name.trim()) {
      errs.name = "El nombre es obligatorio";
    } else if (form.name.trim().length < 3) {
      errs.name = "Debe tener al menos 3 caracteres";
    }
    return errs;
  };

  const handleCreate = () => {
    const errs = validateForm();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    const newCategory = { ...form, id: Date.now() };
    setCategories([...categories, newCategory]);
    setModalCreate(false);
    setForm({ name: "", status: "activo" });
    setErrors({});
  };

  const handleUpdate = () => {
    const errs = validateForm();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setCategories(
      categories.map((c) =>
        c.id === modalEdit.id ? { ...modalEdit, ...form } : c
      )
    );
    setModalEdit(null);
    setForm({ name: "", status: "activo" });
    setErrors({});
  };

  const handleDelete = () => {
    setCategories(categories.filter((c) => c.id !== modalDelete.id));
    setModalDelete(null);
  };

  const openEditModal = (cat) => {
    setModalEdit(cat);
    setForm({ name: cat.name, status: cat.status });
    setErrors({});
  };

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Folder size={22} /> Categorías
        </h2>
        <button
          onClick={() => {
            setModalCreate(true);
            setForm({ name: "", status: "activo" });
            setErrors({});
          }}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg px-3 py-1.5 text-sm shadow transition"
        >
          <Plus size={16} /> Crear
        </button>
      </div>

      {/* Filtro búsqueda */}
      <input
        type="text"
        placeholder="Buscar categoría..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm"
      />

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase tracking-wide">
            <tr>
              <th
                className="py-3 px-5 cursor-pointer"
                onClick={() => {
                  if (sortBy === "name")
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                  else {
                    setSortBy("name");
                    setSortDirection("asc");
                  }
                }}
              >
                <div className="flex items-center gap-1">
                  Nombre <ArrowUpDown size={14} />
                </div>
              </th>
              <th className="py-3 px-5">Estado</th>
              <th className="py-3 px-5">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedCategories.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No se encontraron categorías.
                </td>
              </tr>
            ) : (
              sortedCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-5 text-gray-800 dark:text-white">{cat.name}</td>
                  <td className="py-3 px-5">
                    <span className={`font-medium ${statusColors[cat.status]}`}>
                      {cat.status}
                    </span>
                  </td>
                  <td className="py-3 px-5 flex gap-2 flex-wrap">
                    <button
                      onClick={() => setModalView(cat)}
                      className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1 px-3 py-2 rounded-md text-white transition text-sm"
                    >
                      <Eye size={16} /> View
                    </button>
                    <button
                      onClick={() => openEditModal(cat)}
                      className="bg-yellow-400 hover:bg-yellow-500 flex items-center gap-1 px-3 py-2 rounded-md text-black transition text-sm"
                    >
                      <Pencil size={16} /> Edit
                    </button>
                    <button
                      onClick={() => setModalDelete(cat)}
                      className="flex items-center gap-1 px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition text-sm"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Crear / Editar */}
      {(modalCreate || modalEdit) && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
              {modalCreate ? "Nueva Categoría" : `Editar ${modalEdit.name}`}
            </h3>
            <div className="space-y-3">
              <div>
                <input
                  name="name"
                  placeholder="Nombre"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>
              <select
                name="status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className={inputClass}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setModalCreate(false);
                  setModalEdit(null);
                  setErrors({});
                }}
                className="px-3 py-1.5 text-sm rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={modalCreate ? handleCreate : handleUpdate}
                className="px-3 py-1.5 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ver */}
      {modalView && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Información de la Categoría</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li><strong>Nombre:</strong> {modalView.name}</li>
              <li><strong>Estado:</strong> {modalView.status}</li>
            </ul>
            <div className="mt-6 text-right">
              <button
                onClick={() => setModalView(null)}
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {modalDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-red-600 mb-4">¿Eliminar categoría?</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              Estás a punto de eliminar <strong>{modalDelete.name}</strong>.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalDelete(null)}
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300"
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
