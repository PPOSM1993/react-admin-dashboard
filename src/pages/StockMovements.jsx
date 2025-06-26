import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Eye,
  Pencil,
  Trash2,
  Plus,
  ArrowUpDown,
} from "lucide-react";

// Datos iniciales de ejemplo
const initialStockMovements = [
  {
    id: 1,
    product: "Libro de React",
    type: "Entrada",
    quantity: 5,
    date: "2025-06-20",
    notes: "Compra de stock",
  },
  {
    id: 2,
    product: "Laptop Acer",
    type: "Salida",
    quantity: 1,
    date: "2025-06-19",
    notes: "Venta realizada",
  },
  {
    id: 3,
    product: "Curso de Tailwind",
    type: "Entrada",
    quantity: 10,
    date: "2025-06-15",
    notes: "Donación de cursos",
  },
];

// Opciones para filtro tipo movimiento
const movementTypes = ["Entrada", "Salida"];

const inputClass = "w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm";

export default function StockMovements() {
  const [movements, setMovements] = useState(initialStockMovements);
  const [searchProduct, setSearchProduct] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

  const [modalView, setModalView] = useState(null);
  const [modalEdit, setModalEdit] = useState(null);
  const [modalDelete, setModalDelete] = useState(null);
  const [modalCreate, setModalCreate] = useState(false);

  const [form, setForm] = useState({
    product: "",
    type: "Entrada",
    quantity: "",
    date: "",
    notes: "",
  });

  // Paginación
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // Filtrado
  const filteredMovements = useMemo(() => {
    return movements.filter((m) => {
      const matchesProduct = m.product.toLowerCase().includes(searchProduct.toLowerCase());
      const matchesType = filterType ? m.type === filterType : true;
      const matchesDate = filterDate ? m.date === filterDate : true;
      return matchesProduct && matchesType && matchesDate;
    });
  }, [movements, searchProduct, filterType, filterDate]);

  // Ordenar
  const sortedMovements = useMemo(() => {
    return [...filteredMovements].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredMovements, sortBy, sortDirection]);

  // Paginado
  const totalPages = Math.ceil(sortedMovements.length / itemsPerPage);
  const paginatedMovements = sortedMovements.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Validación simple
  const validateForm = () => {
    const errs = {};
    if (!form.product.trim()) errs.product = "El producto es obligatorio";
    if (!form.quantity || isNaN(Number(form.quantity)) || Number(form.quantity) <= 0)
      errs.quantity = "Cantidad debe ser un número positivo";
    if (!form.date) errs.date = "La fecha es obligatoria";
    if (!movementTypes.includes(form.type)) errs.type = "Tipo inválido";
    return errs;
  };

  const [errors, setErrors] = useState({});

  // Handlers para crear, editar, eliminar
  const handleCreate = () => {
    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const newMovement = {
      ...form,
      id: Date.now(),
      quantity: Number(form.quantity),
    };
    setMovements((prev) => [...prev, newMovement]);
    setModalCreate(false);
    setForm({ product: "", type: "Entrada", quantity: "", date: "", notes: "" });
    setErrors({});
  };

  const handleUpdate = () => {
    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setMovements((prev) =>
      prev.map((m) =>
        m.id === modalEdit.id
          ? { ...modalEdit, ...form, quantity: Number(form.quantity) }
          : m
      )
    );
    setModalEdit(null);
    setForm({ product: "", type: "Entrada", quantity: "", date: "", notes: "" });
    setErrors({});
  };

  const handleDelete = () => {
    setMovements(movements.filter((m) => m.id !== modalDelete.id));
    setModalDelete(null);
  };

  const openEditModal = (movement) => {
    setModalEdit(movement);
    setForm({
      product: movement.product,
      type: movement.type,
      quantity: movement.quantity,
      date: movement.date,
      notes: movement.notes,
    });
    setErrors({});
  };

  // Animación modal
  const modalAnimation = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Plus size={22} /> Movimientos de Stock
        </h2>
        <button
          onClick={() => {
            setModalCreate(true);
            setForm({ product: "", type: "Entrada", quantity: "", date: "", notes: "" });
            setErrors({});
          }}
          className="bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 text-sm flex items-center gap-1"
        >
          <Plus size={16} /> Nuevo movimiento
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchProduct}
          onChange={(e) => setSearchProduct(e.target.value)}
          className={inputClass}
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className={inputClass}
        >
          <option value="">Todos los tipos</option>
          {movementTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase tracking-wide">
            <tr>
              <th
                className="py-3 px-5 cursor-pointer select-none"
                onClick={() => {
                  if (sortBy === "product") setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                  else {
                    setSortBy("product");
                    setSortDirection("asc");
                  }
                }}
              >
                <div className="flex items-center gap-1">
                  Producto <ArrowUpDown size={14} />
                  {sortBy === "product" && (sortDirection === "asc" ? "▲" : "▼")}
                </div>
              </th>
              <th
                className="py-3 px-5 cursor-pointer select-none"
                onClick={() => {
                  if (sortBy === "type") setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                  else {
                    setSortBy("type");
                    setSortDirection("asc");
                  }
                }}
              >
                <div className="flex items-center gap-1">
                  Tipo <ArrowUpDown size={14} />
                  {sortBy === "type" && (sortDirection === "asc" ? "▲" : "▼")}
                </div>
              </th>
              <th className="py-3 px-5">Cantidad</th>
              <th
                className="py-3 px-5 cursor-pointer select-none"
                onClick={() => {
                  if (sortBy === "date") setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                  else {
                    setSortBy("date");
                    setSortDirection("asc");
                  }
                }}
              >
                <div className="flex items-center gap-1">
                  Fecha <ArrowUpDown size={14} />
                  {sortBy === "date" && (sortDirection === "asc" ? "▲" : "▼")}
                </div>
              </th>
              <th className="py-3 px-5">Notas</th>
              <th className="py-3 px-5">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedMovements.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No se encontraron movimientos
                </td>
              </tr>
            ) : (
              paginatedMovements.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-4 px-5 text-gray-800 dark:text-white">{m.product}</td>
                  <td className="py-4 px-5 text-gray-700 dark:text-gray-200">{m.type}</td>
                  <td className="py-4 px-5 text-gray-700 dark:text-gray-200">{m.quantity}</td>
                  <td className="py-4 px-5 text-gray-700 dark:text-gray-200">{m.date}</td>
                  <td className="py-4 px-5 text-gray-700 dark:text-gray-200">{m.notes}</td>
                  <td className="py-4 px-5 flex gap-2 flex-wrap">
                    <button
                      onClick={() => setModalView(m)}
                      className="flex items-center gap-1 px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                      aria-label={`Ver movimiento ${m.id}`}
                    >
                      <Eye size={16} /> Ver
                    </button>
                    <button
                      onClick={() => openEditModal(m)}
                      className="bg-yellow-400 hover:bg-yellow-500 flex items-center gap-1 px-3 py-2 rounded-md transition text-black"
                      aria-label={`Editar movimiento ${m.id}`}
                    >
                      <Pencil size={16} /> Editar
                    </button>
                    <button
                      onClick={() => setModalDelete(m)}
                      className="bg-red-600 hover:bg-red-700 flex items-center gap-1 px-3 py-2 rounded-md transition text-white"
                      aria-label={`Eliminar movimiento ${m.id}`}
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
      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-sm text-gray-600 dark:text-gray-300">
          Página {page} de {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>

      {/* Modales con animación */}

      <AnimatePresence>
        {/* Modal Crear */}
        {modalCreate && (
          <motion.div
            key="modal-create"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={modalAnimation}
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          >
            <motion.div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-xl">
              <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
                Nuevo Movimiento de Stock
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreate();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Producto
                  </label>
                  <input
                    type="text"
                    value={form.product}
                    onChange={(e) => setForm({ ...form, product: e.target.value })}
                    className={inputClass}
                  />
                  {errors.product && <p className="text-red-500 text-xs mt-1">{errors.product}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tipo
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className={inputClass}
                  >
                    {movementTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    className={inputClass}
                  />
                  {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className={inputClass}
                  />
                  {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notas
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className={`${inputClass} resize-y`}
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setModalCreate(false);
                      setErrors({});
                    }}
                    className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 text-sm"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Modal Editar */}
        {modalEdit && (
          <motion.div
            key="modal-edit"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={modalAnimation}
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          >
            <motion.div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-xl">
              <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
                Editar Movimiento de Stock
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdate();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Producto
                  </label>
                  <input
                    type="text"
                    value={form.product}
                    onChange={(e) => setForm({ ...form, product: e.target.value })}
                    className={inputClass}
                  />
                  {errors.product && <p className="text-red-500 text-xs mt-1">{errors.product}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tipo
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className={inputClass}
                  >
                    {movementTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    className={inputClass}
                  />
                  {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className={inputClass}
                  />
                  {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notas
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className={`${inputClass} resize-y`}
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setModalEdit(null);
                      setErrors({});
                    }}
                    className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 text-sm"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Modal Ver */}
        {modalView && (
          <motion.div
            key="modal-view"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={modalAnimation}
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          >
            <motion.div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-xl">
              <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
                Detalles Movimiento de Stock
              </h3>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li><strong>Producto:</strong> {modalView.product}</li>
                <li><strong>Tipo:</strong> {modalView.type}</li>
                <li><strong>Cantidad:</strong> {modalView.quantity}</li>
                <li><strong>Fecha:</strong> {modalView.date}</li>
                <li><strong>Notas:</strong> {modalView.notes}</li>
              </ul>
              <div className="mt-6 text-right">
                <button
                  onClick={() => setModalView(null)}
                  className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Modal Eliminar */}
        {modalDelete && (
          <motion.div
            key="modal-delete"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={modalAnimation}
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          >
            <motion.div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-sm shadow-xl">
              <h3 className="text-lg font-bold text-red-600 mb-4">¿Eliminar movimiento?</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                Estás a punto de eliminar el movimiento del producto <strong>{modalDelete.product}</strong>.
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
