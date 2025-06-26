// Payments.jsx
import { useState, useMemo, useRef } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  Plus,
  ArrowUpDown,
  CreditCard,
  Download,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const initialPayments = [
  { id: 1, payer: "Juan Pérez", date: "2025-06-20", amount: 15990, method: "Transferencia" },
  { id: 2, payer: "María López", date: "2025-06-19", amount: 8990, method: "Efectivo" },
  { id: 3, payer: "Carlos Díaz", date: "2025-06-18", amount: 12400, method: "Tarjeta" },
];

export default function Payments() {
  const [payments, setPayments] = useState(initialPayments);
  const [search, setSearch] = useState("");
  const [modalView, setModalView] = useState(null);
  const [modalEdit, setModalEdit] = useState(null);
  const [modalDelete, setModalDelete] = useState(null);
  const [modalCreate, setModalCreate] = useState(false);

  const filteredPayments = useMemo(() => {
    return payments.filter((p) =>
      p.payer.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, payments]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
      <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <CreditCard size={22} /> Pagos
        </h2>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSearch("")}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre..."
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
            <tr>
              <th className="py-3 px-5">Payer</th>
              <th className="py-3 px-5">Date</th>
              <th className="py-3 px-5">Amount</th>
              <th className="py-3 px-5">Method</th>
              <th className="py-3 px-5">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredPayments.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <td className="py-4 px-5 text-gray-800 dark:text-white capitalize">{p.payer}</td>
                <td className="py-4 px-5 text-gray-600 dark:text-gray-300">{p.date}</td>
                <td className="py-4 px-5 text-gray-800 dark:text-white font-semibold">${p.amount.toLocaleString()}</td>
                <td className="py-4 px-5 text-gray-600 dark:text-gray-300">{p.method}</td>
                <td className="py-4 px-5 flex flex-wrap gap-2">
                  <button
                    onClick={() => setModalView(p)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded bg-blue-500 text-white hover:bg-blue-600"
                  >
                    <Eye size={16} /> Ver
                  </button>
                  <button
                    onClick={() => setModalEdit(p)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded bg-yellow-400 text-black hover:bg-yellow-500"
                  >
                    <Pencil size={16} /> Editar
                  </button>
                  <button
                    onClick={() => setModalDelete(p)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded bg-red-500 text-white hover:bg-red-600"
                  >
                    <Trash2 size={16} /> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {modalCreate && (
          <Modal title="Crear Pago" onClose={() => setModalCreate(false)}>
            <FormModal setModal={setModalCreate} setItems={setPayments} />
          </Modal>
        )}
        {modalView && (
          <Modal title="Detalle del Pago" onClose={() => setModalView(null)}>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
              <p><strong>Pagador:</strong> {modalView.payer}</p>
              <p><strong>Fecha:</strong> {modalView.date}</p>
              <p><strong>Monto:</strong> ${modalView.amount.toLocaleString()}</p>
              <p><strong>Método de pago:</strong> {modalView.method}</p>
            </div>
          </Modal>
        )}
        {modalEdit && (
          <Modal title="Editar Pago" onClose={() => setModalEdit(null)}>
            <FormModal setModal={setModalEdit} setItems={setPayments} item={modalEdit} />
          </Modal>
        )}
        {modalDelete && (
          <Modal title="Eliminar Pago" onClose={() => setModalDelete(null)}>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                ¿Estás seguro de eliminar el pago de <strong>{modalDelete.payer}</strong>?
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
                    setPayments((prev) => prev.filter((p) => p.id !== modalDelete.id));
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
    <motion.div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.98, opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-md"
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
    payer: item?.payer || "",
    date: item?.date || "",
    amount: item?.amount || "",
    method: item?.method || "Transferencia",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setItems((prev) => {
      if (item) {
        return prev.map((p) => (p.id === item.id ? { ...p, ...form } : p));
      } else {
        return [...prev, { ...form, id: Date.now() }];
      }
    });
    setModal(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Payer</label>
        <input
          type="text"
          name="payer"
          value={form.payer}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-sm text-gray-800 dark:text-white"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-sm text-gray-800 dark:text-white"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-sm text-gray-800 dark:text-white"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Method</label>
        <select
          name="method"
          value={form.method}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-sm text-gray-800 dark:text-white"
        >
          <option value="Transferencia">Transferencia</option>
          <option value="Efectivo">Efectivo</option>
          <option value="Tarjeta">Tarjeta</option>
        </select>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
