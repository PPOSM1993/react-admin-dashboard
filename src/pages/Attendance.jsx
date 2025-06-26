import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Eye,
  Pencil,
  Trash2,
  Plus,
  Calendar,
  User,
  X,
} from "lucide-react";

const initialAttendance = [
  {
    id: 1,
    worker: "Juan Pérez",
    date: "2025-06-20",
    status: "Presente",
    notes: "Llegó a tiempo",
  },
  {
    id: 2,
    worker: "María Gómez",
    date: "2025-06-20",
    status: "Ausente",
    notes: "Enfermedad",
  },
  {
    id: 3,
    worker: "Pedro Osorio",
    date: "2025-06-19",
    status: "Presente",
    notes: "",
  },
];

const statusColors = {
  Presente: "text-green-600",
  Ausente: "text-red-600",
  Tardanza: "text-yellow-600",
};

const workersList = [
  "Juan Pérez",
  "María Gómez",
  "Pedro Osorio",
  "Ana Martínez",
  "Luis Fernández",
];

const ITEMS_PER_PAGE = 5;

export default function Attendance() {
  const [attendance, setAttendance] = useState(initialAttendance);
  const [searchWorker, setSearchWorker] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [modalView, setModalView] = useState(null);
  const [modalEdit, setModalEdit] = useState(null);
  const [modalDelete, setModalDelete] = useState(null);
  const [modalCreate, setModalCreate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrar por trabajador y fecha
  const filteredAttendance = useMemo(() => {
    return attendance.filter((a) => {
      const matchWorker = searchWorker
        ? a.worker.toLowerCase().includes(searchWorker.toLowerCase())
        : true;
      const matchDate = filterDate ? a.date === filterDate : true;
      return matchWorker && matchDate;
    });
  }, [attendance, searchWorker, filterDate]);

  // Paginación
  const totalPages = Math.ceil(filteredAttendance.length / ITEMS_PER_PAGE);
  const paginatedAttendance = filteredAttendance.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Formulario estado
  const [form, setForm] = useState({
    worker: "",
    date: "",
    status: "Presente",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  // Validación simple
  const validateForm = () => {
    const errs = {};
    if (!form.worker) errs.worker = "Selecciona un trabajador";
    if (!form.date) errs.date = "Selecciona una fecha";
    if (!form.status) errs.status = "Selecciona un estado";
    return errs;
  };

  const handleCreate = () => {
    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setAttendance([
      ...attendance,
      { ...form, id: Date.now() },
    ]);
    setModalCreate(false);
    setForm({ worker: "", date: "", status: "Presente", notes: "" });
    setErrors({});
  };

  const handleUpdate = () => {
    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setAttendance(
      attendance.map((a) =>
        a.id === modalEdit.id ? { ...modalEdit, ...form } : a
      )
    );
    setModalEdit(null);
    setForm({ worker: "", date: "", status: "Presente", notes: "" });
    setErrors({});
  };

  const handleDelete = () => {
    setAttendance(attendance.filter((a) => a.id !== modalDelete.id));
    setModalDelete(null);
  };

  const openEditModal = (record) => {
    setModalEdit(record);
    setForm({
      worker: record.worker,
      date: record.date,
      status: record.status,
      notes: record.notes,
    });
    setErrors({});
  };

  // Inputs style
  const inputClass = "w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm";

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <User size={22} /> Asistencia
        </h2>
        <button
          onClick={() => {
            setModalCreate(true);
            setForm({ worker: "", date: "", status: "Presente", notes: "" });
            setErrors({});
          }}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 text-white font-semibold rounded-lg px-3 py-1.5 shadow-md transition text-sm"
        >
          <Plus size={16} /> Nuevo
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar trabajador..."
          value={searchWorker}
          onChange={(e) => {
            setSearchWorker(e.target.value);
            setCurrentPage(1);
          }}
          className="flex-grow min-w-[200px] px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
        />
        <input
          type="date"
          value={filterDate}
          onChange={(e) => {
            setFilterDate(e.target.value);
            setCurrentPage(1);
          }}
          className="min-w-[160px] px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
        />
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase tracking-wide">
            <tr>
              <th className="py-4 px-5">Trabajador</th>
              <th className="py-4 px-5">Fecha</th>
              <th className="py-4 px-5">Estado</th>
              <th className="py-4 px-5">Notas</th>
              <th className="py-4 px-5">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedAttendance.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No se encontraron registros
                </td>
              </tr>
            ) : (
              paginatedAttendance.map((record) => (
                <tr
                  key={record.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="py-4 px-5 text-gray-800 dark:text-white">{record.worker}</td>
                  <td className="py-4 px-5 text-gray-700 dark:text-gray-200">{record.date}</td>
                  <td className={`py-4 px-5 text-sm font-semibold ${statusColors[record.status] || ""}`}>
                    {record.status}
                  </td>
                  <td className="py-4 px-5 text-gray-700 dark:text-gray-200">{record.notes}</td>
                  <td className="py-4 px-5 flex gap-2 flex-wrap">
                    <button
                      onClick={() => setModalView(record)}
                      className="flex items-center gap-1 px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                      aria-label={`Ver ${record.worker} - ${record.date}`}
                    >
                      <Eye size={16} /> Ver
                    </button>
                    <button
                      onClick={() => openEditModal(record)}
                      className="bg-yellow-400 hover:bg-yellow-500 flex items-center gap-1 px-3 py-2 rounded-md transition text-black"
                      aria-label={`Editar ${record.worker} - ${record.date}`}
                    >
                      <Pencil size={16} /> Editar
                    </button>
                    <button
                      onClick={() => setModalDelete(record)}
                      className="bg-red-600 hover:bg-red-700 flex items-center gap-1 px-3 py-2 rounded-md transition text-white"
                      aria-label={`Eliminar ${record.worker} - ${record.date}`}
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

      {/* Modal Crear/Editar */}
      <AnimatePresence>
        {(modalCreate || modalEdit) && (
          <Modal
            title={modalCreate ? "Nueva Asistencia" : `Editar Asistencia de ${modalEdit.worker}`}
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Trabajador
                </label>
                <select
                  className={inputClass}
                  value={form.worker}
                  onChange={(e) => setForm({ ...form, worker: e.target.value })}
                >
                  <option value="">Seleccione trabajador</option>
                  {workersList.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
                {errors.worker && <p className="text-red-500 text-xs mt-1">{errors.worker}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Fecha
                </label>
                <input
                  type="date"
                  className={inputClass}
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Estado
                </label>
                <select
                  className={inputClass}
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="Presente">Presente</option>
                  <option value="Ausente">Ausente</option>
                  <option value="Tardanza">Tardanza</option>
                </select>
                {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notas
                </label>
                <textarea
                  className={inputClass}
                  rows="3"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
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
            title={`Asistencia: ${modalView.worker}`}
            onClose={() => setModalView(null)}
          >
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <li>
                <strong>Trabajador:</strong> {modalView.worker}
              </li>
              <li>
                <strong>Fecha:</strong> {modalView.date}
              </li>
              <li>
                <strong>Estado:</strong>{" "}
                <span className={statusColors[modalView.status]}>
                  {modalView.status}
                </span>
              </li>
              <li>
                <strong>Notas:</strong> {modalView.notes || "-"}
              </li>
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
              ¿Eliminar registro de asistencia de{" "}
              <strong>{modalDelete.worker}</strong> del día{" "}
              <strong>{modalDelete.date}</strong>?
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
