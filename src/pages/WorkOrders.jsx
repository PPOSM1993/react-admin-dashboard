// WorkOrders.jsx
import { useState, useMemo } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  Plus,
  Download,
  X,
  ClipboardList,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const initialOrders = [
  {
    id: 1,
    client: "Juan Pérez",
    date: "2025-06-20",
    status: "Completada",
    description: "Revisión general del equipo.",
    technician: "Juan Técnico",
    priority: "Alta",
    serviceType: "Mantenimiento",
    observations: "Cliente pidió revisión extra en batería.",
    estimatedCost: 12000,
    deliveryDate: "2025-06-25",
  },
  {
    id: 2,
    client: "María López",
    date: "2025-06-19",
    status: "En proceso",
    description: "Cambio de repuestos.",
    technician: "María Técnica",
    priority: "Media",
    serviceType: "Reparación",
    observations: "",
    estimatedCost: 8000,
    deliveryDate: "2025-06-23",
  },
  {
    id: 3,
    client: "Carlos Díaz",
    date: "2025-06-18",
    status: "Pendiente",
    description: "Diagnóstico inicial.",
    technician: "Carlos Técnico",
    priority: "Baja",
    serviceType: "Garantía",
    observations: "",
    estimatedCost: "",
    deliveryDate: "",
  },
  {
    id: 4,
    client: "Ana González",
    date: "2025-06-21",
    status: "En proceso",
    description: "Actualización de software.",
    technician: "Juan Técnico",
    priority: "Alta",
    serviceType: "Mantenimiento",
    observations: "Requiere instalación urgente.",
    estimatedCost: 15000,
    deliveryDate: "2025-06-27",
  },
  {
    id: 5,
    client: "Luis Fernández",
    date: "2025-06-17",
    status: "Completada",
    description: "Reparación de pantalla.",
    technician: "María Técnica",
    priority: "Media",
    serviceType: "Reparación",
    observations: "Se reemplazó el display.",
    estimatedCost: 20000,
    deliveryDate: "2025-06-22",
  },
  {
    id: 6,
    client: "Sofía Martínez",
    date: "2025-06-16",
    status: "Pendiente",
    description: "Instalación de nuevo hardware.",
    technician: "Carlos Técnico",
    priority: "Urgente",
    serviceType: "Instalación",
    observations: "Cliente necesita soporte el mismo día.",
    estimatedCost: 25000,
    deliveryDate: "2025-06-20",
  },
  {
    id: 7,
    client: "Pedro Ramírez",
    date: "2025-06-15",
    status: "Completada",
    description: "Optimización de sistema operativo.",
    technician: "Juan Técnico",
    priority: "Baja",
    serviceType: "Mantenimiento",
    observations: "",
    estimatedCost: 10000,
    deliveryDate: "2025-06-19",
  },
  {
    id: 8,
    client: "Laura Herrera",
    date: "2025-06-14",
    status: "En proceso",
    description: "Revisión de conexiones eléctricas.",
    technician: "María Técnica",
    priority: "Alta",
    serviceType: "Garantía",
    observations: "Posible reemplazo de componentes.",
    estimatedCost: 13000,
    deliveryDate: "2025-06-18",
  },
  {
    id: 9,
    client: "Diego Soto",
    date: "2025-06-13",
    status: "Pendiente",
    description: "Configuración de red.",
    technician: "Carlos Técnico",
    priority: "Media",
    serviceType: "Instalación",
    observations: "",
    estimatedCost: 7000,
    deliveryDate: "2025-06-17",
  },
  {
    id: 10,
    client: "Elena Castro",
    date: "2025-06-12",
    status: "Completada",
    description: "Limpieza y mantenimiento preventivo.",
    technician: "Juan Técnico",
    priority: "Baja",
    serviceType: "Mantenimiento",
    observations: "Se mejoró la ventilación del equipo.",
    estimatedCost: 9000,
    deliveryDate: "2025-06-16",
  },
];

const ITEMS_PER_PAGE = 5;

export default function WorkOrders() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalView, setModalView] = useState(null);
  const [modalEdit, setModalEdit] = useState(null);
  const [modalDelete, setModalDelete] = useState(null);
  const [modalCreate, setModalCreate] = useState(false);

  // Filtrado por búsqueda
  const filteredOrders = useMemo(() => {
    return orders.filter((o) =>
      o.client.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, orders]);

  // Paginación
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // Cambiar página, controlar rango
  const goToPage = (n) => {
    if (n < 1) n = 1;
    else if (n > totalPages) n = totalPages;
    setPage(n);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
      <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <ClipboardList size={22} /> Ordenes de Trabajo
        </h2>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => {
              setSearch("");
              setPage(1);
            }}
            className="flex items-center gap-1 px-3 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 text-sm"
          >
            <X size={16} /> Limpiar
          </button>
          <button
            onClick={() => setModalCreate(true)}
            className="flex items-center gap-1 px-3 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 text-sm"
          >
            <Plus size={16} /> Nueva
          </button>
          <button
            onClick={() => alert("Exportar CSV")}
            className="flex items-center gap-1 px-3 py-2 rounded-md bg-indigo-500 text-white hover:bg-indigo-600 text-sm"
          >
            <Download size={16} /> Exportar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Buscar por cliente..."
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
            <tr>
              <th className="py-3 px-5">Cliente</th>
              <th className="py-3 px-5">Fecha</th>
              <th className="py-3 px-5">Estado</th>
              <th className="py-3 px-5">Técnico</th>
              <th className="py-3 px-5">Prioridad</th>
              <th className="py-3 px-5">Tipo de servicio</th>
              <th className="py-3 px-5">Costo Estimado</th>
              <th className="py-3 px-5">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((o) => (
                <tr
                  key={o.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="py-4 px-5 text-gray-800 dark:text-white capitalize">
                    {o.client}
                  </td>
                  <td className="py-4 px-5 text-gray-600 dark:text-gray-300">
                    {o.date}
                  </td>
                  <td className="py-4 px-5 text-gray-800 dark:text-white">
                    {o.status}
                  </td>
                  <td className="py-4 px-5 text-gray-800 dark:text-white">
                    {o.technician || "-"}
                  </td>
                  <td className="py-4 px-5 text-gray-800 dark:text-white">
                    {o.priority || "-"}
                  </td>
                  <td className="py-4 px-5 text-gray-800 dark:text-white">
                    {o.serviceType || "-"}
                  </td>
                  <td className="py-4 px-5 text-gray-800 dark:text-white">
                    {o.estimatedCost !== "" ? `$${o.estimatedCost}` : "-"}
                  </td>
                  <td className="py-4 px-5 flex flex-wrap gap-2">
                    <button
                      onClick={() => setModalView(o)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded bg-blue-500 text-white hover:bg-blue-600"
                    >
                      <Eye size={16} /> Ver
                    </button>
                    <button
                      onClick={() => setModalEdit(o)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded bg-yellow-400 text-black hover:bg-yellow-500"
                    >
                      <Pencil size={16} /> Editar
                    </button>
                    <button
                      onClick={() => setModalDelete(o)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded bg-red-500 text-white hover:bg-red-600"
                    >
                      <Trash2 size={16} /> Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-6 text-gray-600 dark:text-gray-400"
                >
                  No se encontraron órdenes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="mt-4 flex justify-center items-center gap-2 text-gray-700 dark:text-gray-300 select-none">
        <button
          disabled={page === 1}
          onClick={() => goToPage(page - 1)}
          className={`px-3 py-1 rounded ${
            page === 1
              ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
              : "bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
          }`}
        >
          {"<"}
        </button>
        {[...Array(totalPages).keys()].map((p) => (
          <button
            key={p}
            onClick={() => goToPage(p + 1)}
            className={`px-3 py-1 rounded ${
              page === p + 1
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
            }`}
          >
            {p + 1}
          </button>
        ))}
        <button
          disabled={page === totalPages}
          onClick={() => goToPage(page + 1)}
          className={`px-3 py-1 rounded ${
            page === totalPages || totalPages === 0
              ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
              : "bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
          }`}
        >
          {">"}
        </button>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {modalCreate && (
          <Modal title="Crear Orden" onClose={() => setModalCreate(false)}>
            <FormModal setModal={setModalCreate} setItems={setOrders} />
          </Modal>
        )}
        {modalView && (
          <Modal title="Detalle de Orden" onClose={() => setModalView(null)}>
            <div className="space-y-2 text-sm text-gray-800 dark:text-white">
              <p>
                <strong>Cliente:</strong> {modalView.client}
              </p>
              <p>
                <strong>Fecha:</strong> {modalView.date}
              </p>
              <p>
                <strong>Estado:</strong> {modalView.status}
              </p>
              <p>
                <strong>Técnico asignado:</strong> {modalView.technician || "-"}
              </p>
              <p>
                <strong>Prioridad:</strong> {modalView.priority || "-"}
              </p>
              <p>
                <strong>Tipo de servicio:</strong> {modalView.serviceType || "-"}
              </p>
              <p>
                <strong>Descripción:</strong> {modalView.description}
              </p>
              <p>
                <strong>Observaciones adicionales:</strong>{" "}
                {modalView.observations || "-"}
              </p>
              <p>
                <strong>Costo estimado:</strong>{" "}
                {modalView.estimatedCost !== ""
                  ? `$${modalView.estimatedCost}`
                  : "-"}
              </p>
              <p>
                <strong>Fecha de entrega prevista:</strong>{" "}
                {modalView.deliveryDate || "-"}
              </p>
            </div>
          </Modal>
        )}
        {modalEdit && (
          <Modal title="Editar Orden" onClose={() => setModalEdit(null)}>
            <FormModal
              setModal={setModalEdit}
              setItems={setOrders}
              item={modalEdit}
            />
          </Modal>
        )}
        {modalDelete && (
          <Modal title="Eliminar Orden" onClose={() => setModalDelete(null)}>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                ¿Estás seguro de eliminar la orden de{" "}
                <strong>{modalDelete.client}</strong>?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
                  onClick={() => setModalDelete(null)}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                  onClick={() => {
                    setOrders((prev) =>
                      prev.filter((r) => r.id !== modalDelete.id)
                    );
                    setModalDelete(null);
                    // Si eliminamos el último elemento de la última página,
                    // ajustamos página hacia atrás si no hay elementos.
                    if (
                      (page - 1) * ITEMS_PER_PAGE >=
                      filteredOrders.length - 1
                    ) {
                      goToPage(page - 1);
                    }
                  }}
                >
                  Eliminar
                </button>
              </div>
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-xl max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {title}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500">
            <X size={20} />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

function FormModal({ setModal, setItems, item }) {
  const [form, setForm] = useState({
    client: item?.client || "",
    date: item?.date || "",
    status: item?.status || "Pendiente",
    description: item?.description || "",
    technician: item?.technician || "",
    priority: item?.priority || "Media",
    serviceType: item?.serviceType || "Mantenimiento",
    observations: item?.observations || "",
    estimatedCost:
      item?.estimatedCost !== undefined ? String(item.estimatedCost) : "",
    deliveryDate: item?.deliveryDate || "",
  });

  const technicians = ["Juan Técnico", "María Técnica", "Carlos Técnico"];
  const priorities = ["Baja", "Media", "Alta", "Urgente"];
  const statuses = ["Pendiente", "En proceso", "Completada", "Cancelada"];
  const serviceTypes = ["Mantenimiento", "Reparación", "Garantía", "Instalación"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Validaciones simples
  const isValid =
    form.client.trim() !== "" &&
    form.date.trim() !== "" &&
    form.status.trim() !== "" &&
    form.description.trim() !== "";

  const onSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    if (item) {
      // Editar
      setItems((prev) =>
        prev.map((o) => (o.id === item.id ? { ...item, ...form, estimatedCost: Number(form.estimatedCost) || "" } : o))
      );
    } else {
      // Crear nuevo con id autoincremental
      setItems((prev) => [
        ...prev,
        {
          ...form,
          id: prev.length > 0 ? prev[prev.length - 1].id + 1 : 1,
          estimatedCost: Number(form.estimatedCost) || "",
        },
      ]);
    }
    setModal(null);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 text-gray-800 dark:text-white">
      <div>
        <label className="block mb-1 font-medium">Cliente *</label>
        <input
          type="text"
          name="client"
          value={form.client}
          onChange={handleChange}
          className="w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
          required
          autoFocus={!item}
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Fecha *</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Estado *</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
          required
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Técnico</label>
        <select
          name="technician"
          value={form.technician}
          onChange={handleChange}
          className="w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
        >
          <option value="">-- Ninguno --</option>
          {technicians.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Prioridad</label>
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
        >
          {priorities.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Tipo de servicio</label>
        <select
          name="serviceType"
          value={form.serviceType}
          onChange={handleChange}
          className="w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
        >
          {serviceTypes.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Descripción *</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className="w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Observaciones</label>
        <textarea
          name="observations"
          value={form.observations}
          onChange={handleChange}
          rows={2}
          className="w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Costo estimado</label>
        <input
          type="number"
          name="estimatedCost"
          value={form.estimatedCost}
          onChange={handleChange}
          min="0"
          className="w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Fecha de entrega prevista</label>
        <input
          type="date"
          name="deliveryDate"
          value={form.deliveryDate}
          onChange={handleChange}
          className="w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={() => setModal(null)}
          className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!isValid}
          className={`px-4 py-2 rounded text-white ${
            isValid ? "bg-green-600 hover:bg-green-700" : "bg-green-300 cursor-not-allowed"
          }`}
        >
          {item ? "Guardar cambios" : "Crear"}
        </button>
      </div>
    </form>
  );
}
