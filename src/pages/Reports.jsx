// Reports.jsx
import { useState, useMemo } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  Plus,
  Download,
  X,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const initialReports = [
  { id: 1, title: "Ventas Semanales", date: "2025-06-20", summary: "Resumen semanal de ventas." },
  { id: 2, title: "Inventario Actual", date: "2025-06-18", summary: "Reporte de stock disponible." },
  { id: 3, title: "Ingresos Mensuales", date: "2025-06-01", summary: "Resumen mensual de ingresos." },
  { id: 4, title: "Reporte Diario", date: "2025-06-21", summary: "Detalle diario de operaciones." },
  { id: 5, title: "Balance Trimestral", date: "2025-06-10", summary: "Balance del trimestre." },
  { id: 6, title: "Reporte Anual", date: "2025-01-01", summary: "Análisis del año completo." },
];

export default function Reports() {
  const [reports, setReports] = useState(initialReports);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [modalView, setModalView] = useState(null);
  const [modalEdit, setModalEdit] = useState(null);
  const [modalDelete, setModalDelete] = useState(null);
  const [modalCreate, setModalCreate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchTitle = r.title.toLowerCase().includes(search.toLowerCase());
      const matchDateFrom = dateFrom ? r.date >= dateFrom : true;
      const matchDateTo = dateTo ? r.date <= dateTo : true;
      return matchTitle && matchDateFrom && matchDateTo;
    });
  }, [search, reports, dateFrom, dateTo]);

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setSearch("");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
      <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <BarChart3 size={22} /> Reportes
        </h2>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={resetFilters}
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
          <button
            onClick={() => alert("Exportar CSV")}
            className="flex items-center gap-1 px-3 py-2 rounded-md bg-indigo-500 text-white hover:bg-indigo-600 text-sm"
          >
            <Download size={16} /> Exportar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por título..."
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm"
        />
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
            <tr>
              <th className="py-3 px-5">Título</th>
              <th className="py-3 px-5">Fecha</th>
              <th className="py-3 px-5">Resumen</th>
              <th className="py-3 px-5">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedReports.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <td className="py-4 px-5 text-gray-800 dark:text-white capitalize">{r.title}</td>
                <td className="py-4 px-5 text-gray-600 dark:text-gray-300">{r.date}</td>
                <td className="py-4 px-5 text-gray-800 dark:text-white">{r.summary}</td>
                <td className="py-4 px-5 flex flex-wrap gap-2">
                  <button onClick={() => setModalView(r)} className="flex items-center gap-1 px-3 py-1.5 rounded bg-blue-500 text-white hover:bg-blue-600">
                    <Eye size={16} /> Ver
                  </button>
                  <button onClick={() => setModalEdit(r)} className="flex items-center gap-1 px-3 py-1.5 rounded bg-yellow-400 text-black hover:bg-yellow-500">
                    <Pencil size={16} /> Editar
                  </button>
                  <button onClick={() => setModalDelete(r)} className="flex items-center gap-1 px-3 py-1.5 rounded bg-red-500 text-white hover:bg-red-600">
                    <Trash2 size={16} /> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded bg-gray-200 dark:bg-gray-700 text-sm disabled:opacity-50"
        >
          <ChevronLeft size={16} /> Anterior
        </button>
        <span className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-1.5 rounded bg-gray-200 dark:bg-gray-700 text-sm disabled:opacity-50"
        >
          Siguiente <ChevronRight size={16} />
        </button>
      </div>

      <AnimatePresence>
        {modalCreate && (
          <Modal title="Crear Reporte" onClose={() => setModalCreate(false)}>
            <FormModal setModal={setModalCreate} setItems={setReports} />
          </Modal>
        )}
        {modalView && (
          <Modal title="Detalle del Reporte" onClose={() => setModalView(null)}>
            <div className="space-y-2 text-sm text-gray-800 dark:text-white">
              <p><strong>Título:</strong> {modalView.title}</p>
              <p><strong>Fecha:</strong> {modalView.date}</p>
              <p><strong>Resumen:</strong> {modalView.summary}</p>
            </div>
          </Modal>
        )}
        {modalEdit && (
          <Modal title="Editar Reporte" onClose={() => setModalEdit(null)}>
            <FormModal setModal={setModalEdit} setItems={setReports} item={modalEdit} />
          </Modal>
        )}
        {modalDelete && (
          <Modal title="Eliminar Reporte" onClose={() => setModalDelete(null)}>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                ¿Estás seguro de eliminar el reporte <strong>{modalDelete.title}</strong>?
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
                    setReports((prev) => prev.filter((r) => r.id !== modalDelete.id));
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

function Modal({ title, children, onClose }) {
  return (
    <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-md"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
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
    title: item?.title || "",
    date: item?.date || "",
    summary: item?.summary || "",
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Título</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-sm text-gray-800 dark:text-white"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Fecha</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-sm text-gray-800 dark:text-white"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Resumen</label>
        <textarea
          name="summary"
          rows="3"
          value={form.summary}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-sm text-gray-800 dark:text-white"
        />
      </div>
      <div className="flex justify-end">
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm">
          Guardar
        </button>
      </div>
    </form>
  );
}
