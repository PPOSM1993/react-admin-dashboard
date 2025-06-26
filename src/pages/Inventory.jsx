import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Eye,
  Pencil,
  Trash2,
  Plus,
  Box,
  X,
} from "lucide-react";

const initialInventory = [
  {
    id: 1,
    name: "Cable HDMI",
    quantity: 30,
    location: "Bodega A",
    status: "activo",
    description: "Cable HDMI 2 metros",
  },
  {
    id: 2,
    name: "Monitor 24 pulgadas",
    quantity: 10,
    location: "Bodega B",
    status: "activo",
    description: "Monitor LCD Full HD",
  },
  {
    id: 3,
    name: "Teclado mecánico",
    quantity: 5,
    location: "Bodega A",
    status: "inactivo",
    description: "Teclado retroiluminado",
  },
];

const statusColors = {
  activo: "text-green-600",
  inactivo: "text-red-600",
};

const ITEMS_PER_PAGE = 5;

export default function Inventory() {
  const [inventory, setInventory] = useState(initialInventory);
  const [searchName, setSearchName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [modalView, setModalView] = useState(null);
  const [modalEdit, setModalEdit] = useState(null);
  const [modalDelete, setModalDelete] = useState(null);
  const [modalCreate, setModalCreate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [form, setForm] = useState({
    name: "",
    quantity: "",
    location: "",
    status: "activo",
    description: "",
  });

  const [errors, setErrors] = useState({});

  // Filtrar y buscar
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchesName = item.name.toLowerCase().includes(searchName.toLowerCase());
      const matchesStatus = filterStatus ? item.status === filterStatus : true;
      return matchesName && matchesStatus;
    });
  }, [inventory, searchName, filterStatus]);

  // Paginación
  const totalPages = Math.ceil(filteredInventory.length / ITEMS_PER_PAGE);
  const paginatedInventory = filteredInventory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Validación formulario
  const validateForm = () => {
    const errs = {};
    if (!form.name.trim()) {
      errs.name = "El nombre es obligatorio";
    } else if (form.name.trim().length < 3) {
      errs.name = "El nombre debe tener al menos 3 caracteres";
    }

    if (form.quantity === "" || form.quantity === null) {
      errs.quantity = "La cantidad es obligatoria";
    } else if (isNaN(Number(form.quantity)) || Number(form.quantity) < 0) {
      errs.quantity = "La cantidad debe ser un número entero positivo o cero";
    } else if (!Number.isInteger(Number(form.quantity))) {
      errs.quantity = "La cantidad debe ser un número entero";
    }

    if (!form.location.trim()) {
      errs.location = "La ubicación es obligatoria";
    }

    if (!["activo", "inactivo"].includes(form.status)) {
      errs.status = "Estado inválido";
    }

    return errs;
  };

  // Crear inventario
  const handleCreate = () => {
    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const newItem = {
      ...form,
      id: Date.now(),
      quantity: Number(form.quantity),
    };

    setInventory([...inventory, newItem]);
    setModalCreate(false);
    setForm({ name: "", quantity: "", location: "", status: "activo", description: "" });
    setErrors({});
  };

  // Actualizar inventario
  const handleUpdate = () => {
    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setInventory(
      inventory.map((item) =>
        item.id === modalEdit.id
          ? { ...modalEdit, ...form, quantity: Number(form.quantity) }
          : item
      )
    );

    setModalEdit(null);
    setForm({ name: "", quantity: "", location: "", status: "activo", description: "" });
    setErrors({});
  };

  // Eliminar inventario
  const handleDelete = () => {
    setInventory(inventory.filter((item) => item.id !== modalDelete.id));
    setModalDelete(null);
  };

  // Abrir modal editar
  const openEditModal = (item) => {
    setModalEdit(item);
    setForm({
      name: item.name,
      quantity: item.quantity,
      location: item.location,
      status: item.status,
      description: item.description,
    });
    setErrors({});
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm";

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Box size={22} /> Inventario
        </h2>
        <button
          onClick={() => {
            setModalCreate(true);
            setForm({ name: "", quantity: "", location: "", status: "activo", description: "" });
            setErrors({});
          }}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 text-white font-semibold rounded-lg px-3 py-1.5 shadow-md transition text-sm"
        >
          <Plus size={16} /> Nuevo ítem
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchName}
          onChange={(e) => {
            setSearchName(e.target.value);
            setCurrentPage(1);
          }}
          className="flex-grow min-w-[200px] px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
        />
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="min-w-[140px] px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
        >
          <option value="">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase tracking-wide">
            <tr>
              <th className="py-4 px-5">Nombre</th>
              <th className="py-4 px-5">Cantidad</th>
              <th className="py-4 px-5">Ubicación</th>
              <th className="py-4 px-5">Estado</th>
              <th className="py-4 px-5">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedInventory.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No se encontraron ítems
                </td>
              </tr>
            ) : (
              paginatedInventory.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="py-4 px-5 text-gray-800 dark:text-white">{item.name}</td>
                  <td className="py-4 px-5 text-gray-700 dark:text-gray-200">{item.quantity}</td>
                  <td className="py-4 px-5 text-gray-700 dark:text-gray-200">{item.location}</td>
                  <td className={`py-4 px-5 text-sm font-semibold ${statusColors[item.status]}`}>
                    {item.status}
                  </td>
                  <td className="py-4 px-5 flex gap-2 flex-wrap">
                    <button
                      onClick={() => setModalView(item)}
                      className="flex items-center gap-1 px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                      aria-label={`Ver ${item.name}`}
                    >
                      <Eye size={16} /> Ver
                    </button>
                    <button
                      onClick={() => openEditModal(item)}
                      className="bg-yellow-400 hover:bg-yellow-500 flex items-center gap-1 px-3 py-2 rounded-md transition text-black"
                      aria-label={`Editar ${item.name}`}
                    >
                      <Pencil size={16} /> Editar
                    </button>
                    <button
                      onClick={() => setModalDelete(item)}
                      className="bg-red-600 hover:bg-red-700 flex items-center gap-1 px-3 py-2 rounded-md transition text-white"
                      aria-label={`Eliminar ${item.name}`}
                    >
                      <Trash2 size={16} /> Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-center gap-2 mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-40"
        >
          Anterior
        </button>
        <span className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
          Página {currentPage} de {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>

      {/* Modales */}
      <AnimatePresence>
        {(modalCreate || modalEdit) && (
          <Modal
            title={modalCreate ? "Nuevo ítem de inventario" : `Editar ${modalEdit.name}`}
            onClose={() => {
              setModalCreate(false);
              setModalEdit(null);
              setErrors({});
            }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                modalCreate ? handleCreate() : handleUpdate();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
                <input
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nombre del ítem"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cantidad</label>
                <input
                  className={inputClass}
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  type="number"
                  min="0"
                  placeholder="Cantidad en stock"
                />
                {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ubicación</label>
                <input
                  className={inputClass}
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Ubicación física"
                />
                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Estado</label>
                <select
                  className={inputClass}
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
                {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
                <textarea
                  className={inputClass}
                  rows="3"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Descripción adicional"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setModalCreate(false);
                    setModalEdit(null);
                    setErrors({});
                  }}
                  className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          </Modal>
        )}

        {/* Modal Ver */}
        {modalView && (
          <Modal
            title={`Detalles: ${modalView.name}`}
            onClose={() => setModalView(null)}
          >
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>Nombre:</strong> {modalView.name}</li>
              <li><strong>Cantidad:</strong> {modalView.quantity}</li>
              <li><strong>Ubicación:</strong> {modalView.location}</li>
              <li><strong>Estado:</strong> <span className={statusColors[modalView.status]}>{modalView.status}</span></li>
              <li><strong>Descripción:</strong> {modalView.description || "-"}</li>
            </ul>
            <div className="mt-6 text-right">
              <button
                onClick={() => setModalView(null)}
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300"
              >
                Cerrar
              </button>
            </div>
          </Modal>
        )}

        {/* Modal Eliminar */}
        {modalDelete && (
          <Modal
            title="Confirmar eliminación"
            onClose={() => setModalDelete(null)}
          >
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              ¿Eliminar ítem <strong>{modalDelete.name}</strong>?
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
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-xl w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500"
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}
