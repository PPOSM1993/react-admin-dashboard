// SupportTickets.jsx
import { useState, useMemo } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  Plus,
  X,
  ClipboardList,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const initialTickets = [
  {
    id: 1,
    client: "Juan Pérez",
    subject: "No enciende el equipo",
    dateCreated: "2025-06-20",
    status: "Pendiente",
    priority: "Alta",
    assignedTo: "María Técnica",
    description: "El equipo no enciende después del mantenimiento.",
    comments: "",
  },
  {
    id: 2,
    client: "María López",
    subject: "Problema con impresora",
    dateCreated: "2025-06-19",
    status: "En proceso",
    priority: "Media",
    assignedTo: "Carlos Técnico",
    description: "La impresora no responde y muestra error de papel.",
    comments: "Se solicitó repuesto.",
  },
  {
    id: 3,
    client: "Carlos Díaz",
    subject: "Pantalla no responde",
    dateCreated: "2025-06-18",
    status: "Resuelto",
    priority: "Alta",
    assignedTo: "Juan Técnico",
    description: "Se reemplazó el cable flex de la pantalla.",
    comments: "Cliente satisfecho.",
  },
  {
    id: 4,
    client: "Ana Torres",
    subject: "Error de conexión WiFi",
    dateCreated: "2025-06-17",
    status: "Pendiente",
    priority: "Baja",
    assignedTo: "María Técnica",
    description: "El equipo pierde señal WiFi constantemente.",
    comments: "",
  },
  {
    id: 5,
    client: "Luis Martínez",
    subject: "Problema con software",
    dateCreated: "2025-06-16",
    status: "En proceso",
    priority: "Urgente",
    assignedTo: "Carlos Técnico",
    description: "La aplicación se cierra inesperadamente.",
    comments: "Se está revisando con desarrollo.",
  },
  {
    id: 6,
    client: "Sofía Gómez",
    subject: "No se puede imprimir",
    dateCreated: "2025-06-15",
    status: "Cerrado",
    priority: "Media",
    assignedTo: "Juan Técnico",
    description: "Impresora atascada con error de papel.",
    comments: "Reparación completada.",
  },
];

const statuses = ["Pendiente", "En proceso", "Resuelto", "Cerrado"];
const priorities = ["Baja", "Media", "Alta", "Urgente"];

export default function SupportTickets() {
  const [tickets, setTickets] = useState(initialTickets);

  // Filtros y paginacion
  const [searchClient, setSearchClient] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const filteredTickets = useMemo(() => {
    return tickets
      .filter((t) =>
        t.client.toLowerCase().includes(searchClient.toLowerCase())
      )
      .filter((t) => (filterStatus ? t.status === filterStatus : true))
      .filter((t) => (filterPriority ? t.priority === filterPriority : true));
  }, [tickets, searchClient, filterStatus, filterPriority]);

  const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE);

  const paginatedTickets = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredTickets.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTickets, page]);

  // Modales
  const [modalView, setModalView] = useState(null);
  const [modalEdit, setModalEdit] = useState(null);
  const [modalDelete, setModalDelete] = useState(null);
  const [modalCreate, setModalCreate] = useState(false);

  // Reset page if filters/search change
  // (optional) useEffect(() => setPage(1), [searchClient, filterStatus, filterPriority]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
      <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <ClipboardList size={22} /> Tickets de Soporte
        </h2>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => {
              setSearchClient("");
              setFilterStatus("");
              setFilterPriority("");
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
            <Plus size={16} /> Nuevo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <input
          type="text"
          value={searchClient}
          onChange={(e) => {
            setSearchClient(e.target.value);
            setPage(1);
          }}
          placeholder="Buscar por cliente..."
          className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm"
        />
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(1);
          }}
          className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm"
        >
          <option value="">Todos los estados</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={filterPriority}
          onChange={(e) => {
            setFilterPriority(e.target.value);
            setPage(1);
          }}
          className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm"
        >
          <option value="">Todas las prioridades</option>
          {priorities.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
            <tr>
              <th className="py-3 px-5">Cliente</th>
              <th className="py-3 px-5">Asunto</th>
              <th className="py-3 px-5">Fecha</th>
              <th className="py-3 px-5">Estado</th>
              <th className="py-3 px-5">Prioridad</th>
              <th className="py-3 px-5">Técnico</th>
              <th className="py-3 px-5">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedTickets.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-6 px-5 text-center text-gray-500 dark:text-gray-400"
                >
                  No hay tickets que mostrar.
                </td>
              </tr>
            ) : (
              paginatedTickets.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="py-4 px-5 text-gray-800 dark:text-white capitalize">
                    {t.client}
                  </td>
                  <td className="py-4 px-5 text-gray-600 dark:text-gray-300">
                    {t.subject}
                  </td>
                  <td className="py-4 px-5 text-gray-600 dark:text-gray-300">
                    {t.dateCreated}
                  </td>
                  <td className="py-4 px-5 text-gray-800 dark:text-white">
                    {t.status}
                  </td>
                  <td className="py-4 px-5 text-gray-800 dark:text-white">
                    {t.priority}
                  </td>
                  <td className="py-4 px-5 text-gray-800 dark:text-white">
                    {t.assignedTo}
                  </td>
                  <td className="py-4 px-5 flex flex-wrap gap-2">
                    <button
                      onClick={() => setModalView(t)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded bg-blue-500 text-white hover:bg-blue-600"
                    >
                      <Eye size={16} /> Ver
                    </button>
                    <button
                      onClick={() => setModalEdit(t)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded bg-yellow-400 text-black hover:bg-yellow-500"
                    >
                      <Pencil size={16} /> Editar
                    </button>
                    <button
                      onClick={() => setModalDelete(t)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded bg-red-500 text-white hover:bg-red-600"
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
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600 dark:text-gray-400">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className={`px-3 py-1 rounded ${
            page <= 1
              ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
              : "bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
          }`}
        >
          Anterior
        </button>
        <span>
          Página {page} de {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className={`px-3 py-1 rounded ${
            page >= totalPages
              ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
              : "bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
          }`}
        >
          Siguiente
        </button>
      </div>

      <AnimatePresence>
        {modalCreate && (
          <Modal title="Crear Ticket de Soporte" onClose={() => setModalCreate(false)}>
            <FormModal setModal={setModalCreate} setItems={setTickets} />
          </Modal>
        )}
        {modalView && (
          <Modal title="Detalle del Ticket" onClose={() => setModalView(null)}>
            <div className="space-y-2 text-sm text-gray-800 dark:text-white">
              <p><strong>Cliente:</strong> {modalView.client}</p>
              <p><strong>Asunto:</strong> {modalView.subject}</p>
              <p><strong>Fecha:</strong> {modalView.dateCreated}</p>
              <p><strong>Estado:</strong> {modalView.status}</p>
              <p><strong>Prioridad:</strong> {modalView.priority}</p>
              <p><strong>Técnico asignado:</strong> {modalView.assignedTo}</p>
              <p><strong>Descripción:</strong> {modalView.description}</p>
              <p><strong>Comentarios:</strong> {modalView.comments || "-"}</p>
            </div>
          </Modal>
        )}
        {modalEdit && (
          <Modal title="Editar Ticket de Soporte" onClose={() => setModalEdit(null)}>
            <FormModal setModal={setModalEdit} setItems={setTickets} item={modalEdit} />
          </Modal>
        )}
        {modalDelete && (
          <Modal title="Eliminar Ticket" onClose={() => setModalDelete(null)}>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                ¿Estás seguro de eliminar el ticket de <strong>{modalDelete.client}</strong> con asunto <strong>{modalDelete.subject}</strong>?
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
                    setTickets((prev) => prev.filter((r) => r.id !== modalDelete.id));
                    setModalDelete(null);
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

// Modal y FormModal quedan igual que antes, no las repito aquí por brevedad.

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
        className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
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
    subject: item?.subject || "",
    dateCreated: item?.dateCreated || "",
    status: item?.status || "Pendiente",
    priority: item?.priority || "Media",
    assignedTo: item?.assignedTo || "",
    description: item?.description || "",
    comments: item?.comments || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setItems((prev) => {
      if (item) {
        return prev.map((r) => (r.id === item.id ? { ...r, ...form } : r));
      } else {
        return [...prev, { ...form, id: Date.now() }];
      }
    });
    setModal(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cliente</label>
          <input
            type="text"
            name="client"
            value={form.client}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-sm text-gray-800 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Asunto</label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-sm text-gray-800 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Fecha Creación</label>
          <input
            type="date"
            name="dateCreated"
            value={form.dateCreated}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-sm text-gray-800 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-sm text-gray-800 dark:text-white"
            required
          >
            <option value="Pendiente">Pendiente</option>
            <option value="En proceso">En proceso</option>
            <option value="Resuelto">Resuelto</option>
            <option value="Cerrado">Cerrado</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Prioridad</label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-sm text-gray-800 dark:text-white"
            required
          >
            <option value="Baja">Baja</option>
            <option value="Media">Media</option>
            <option value="Alta">Alta</option>
            <option value="Urgente">Urgente</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Técnico asignado</label>
          <input
            type="text"
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-sm text-gray-800 dark:text-white"
          />
        </div>
      </div>

      <section className="pt-4">
        <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-700 pb-1">
          Descripción y Comentarios
        </h4>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={form.description}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-sm text-gray-800 dark:text-white"
              placeholder="Detalles del problema o solicitud"
            />
          </div>
          <div>
            <label
              htmlFor="comments"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Comentarios adicionales
            </label>
            <textarea
              id="comments"
              name="comments"
              rows="3"
              value={form.comments}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-sm text-gray-800 dark:text-white"
              placeholder="Comentarios internos o adicionales"
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end pt-4 border-t border-gray-300 dark:border-gray-700">
        <button
          type="submit"
          className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
