import { useState, useMemo } from "react";
import { Plus, Eye, Pencil, Trash2, Package, X } from "lucide-react";

const initialBuys = [
  {
    id: 1,
    supplier: "Proveedor Uno",
    date: "2025-06-20",
    status: "completado",
    total: 152000,
    items: 3,
  },
  {
    id: 2,
    supplier: "Proveedor Dos",
    date: "2025-06-21",
    status: "pendiente",
    total: 87990,
    items: 5,
  },
];

const statusColors = {
  completado: "text-green-600",
  pendiente: "text-yellow-600",
  cancelado: "text-red-600",
};

export default function Buy() {
  const [buys, setBuys] = useState(initialBuys);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [modalView, setModalView] = useState(null);
  const [modalDelete, setModalDelete] = useState(null);
  const [modalCreate, setModalCreate] = useState(false);
  const [form, setForm] = useState({
    supplier: "",
    date: "",
    status: "pendiente",
    total: "",
    items: "",
  });
  const [errors, setErrors] = useState({});

  const filteredBuys = useMemo(() => {
    return buys.filter((b) => {
      const matchesSearch = b.supplier.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter ? b.status === statusFilter : true;
      const matchesDate = dateFilter ? b.date === dateFilter : true;
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [buys, search, statusFilter, dateFilter]);

  const handleCreate = () => {
    const newErrors = {};
    if (!form.supplier) newErrors.supplier = "Proveedor requerido";
    if (!form.date) newErrors.date = "Fecha requerida";
    if (!form.total) newErrors.total = "Total requerido";
    if (!form.items) newErrors.items = "Cantidad requerida";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const newBuy = { ...form, id: Date.now() };
    setBuys([...buys, newBuy]);
    setModalCreate(false);
    setForm({ supplier: "", date: "", status: "pendiente", total: "", items: "" });
    setErrors({});
  };

  const handleDelete = () => {
    setBuys(buys.filter((b) => b.id !== modalDelete.id));
    setModalDelete(null);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
          <Package size={22} /> Compras
        </h2>
        <button
          onClick={() => setModalCreate(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded"
        >
          <Plus size={16} /> Nueva Compra
        </button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar proveedor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded dark:bg-gray-800 dark:text-white"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded dark:bg-gray-800 dark:text-white"
        >
          <option value="">Filtrar por estado</option>
          <option value="pendiente">Pendiente</option>
          <option value="completado">Completado</option>
          <option value="cancelado">Cancelado</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-3 py-2 border rounded dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 uppercase">
            <tr>
              <th className="px-4 py-3">Proveedor</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Ítems</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredBuys.map((buy) => (
              <tr key={buy.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-4 py-3">{buy.supplier}</td>
                <td className="px-4 py-3">{buy.date}</td>
                <td className="px-4 py-3">
                  <span className={`font-medium ${statusColors[buy.status]}`}>
                    {buy.status}
                  </span>
                </td>
                <td className="px-4 py-3">${buy.total.toLocaleString()}</td>
                <td className="px-4 py-3">{buy.items}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => setModalView(buy)} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1 px-3 py-2 rounded-md text-white transition text-sm">
                    <Eye size={16} /> Ver
                  </button>
                  <button onClick={() => setModalDelete(buy)} className="flex items-center gap-1 px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition text-sm">
                    <Trash2 size={16} /> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL CREAR */}
      {modalCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-lg shadow-lg animate-modal relative">
            <button
              onClick={() => {
                setModalCreate(false);
                setErrors({});
              }}
              className="absolute top-4 right-4 hover:bg-gray-200 dark:hover:bg-gray-800 p-1 rounded"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Registrar Compra</h3>

            <div className="grid grid-cols-1 gap-3">
              <input
                placeholder="Proveedor"
                value={form.supplier}
                onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                className={`px-3 py-2 border rounded dark:bg-gray-800 dark:text-white ${
                  errors.supplier ? "border-red-500" : "border-gray-300"
                }`}
              />
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className={`px-3 py-2 border rounded dark:bg-gray-800 dark:text-white ${
                  errors.date ? "border-red-500" : "border-gray-300"
                }`}
              />
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="px-3 py-2 border rounded dark:bg-gray-800 dark:text-white"
              >
                <option value="pendiente">Pendiente</option>
                <option value="completado">Completado</option>
                <option value="cancelado">Cancelado</option>
              </select>
              <input
                type="number"
                placeholder="Total"
                value={form.total}
                onChange={(e) => setForm({ ...form, total: e.target.value })}
                className={`px-3 py-2 border rounded dark:bg-gray-800 dark:text-white ${
                  errors.total ? "border-red-500" : "border-gray-300"
                }`}
              />
              <input
                type="number"
                placeholder="Cantidad de ítems"
                value={form.items}
                onChange={(e) => setForm({ ...form, items: e.target.value })}
                className={`px-3 py-2 border rounded dark:bg-gray-800 dark:text-white ${
                  errors.items ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={handleCreate}
                className="px-4 py-2 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL VER */}
      {modalView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-lg animate-modal relative">
            <button
              onClick={() => setModalView(null)}
              className="absolute top-4 right-4 hover:bg-gray-200 dark:hover:bg-gray-800 p-1 rounded"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Detalles de Compra</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li><strong>Proveedor:</strong> {modalView.supplier}</li>
              <li><strong>Fecha:</strong> {modalView.date}</li>
              <li><strong>Estado:</strong> {modalView.status}</li>
              <li><strong>Total:</strong> ${modalView.total.toLocaleString()}</li>
              <li><strong>Ítems:</strong> {modalView.items}</li>
            </ul>
            <div className="mt-6 text-right">
              <button
                onClick={() => setModalView(null)}
                className="px-4 py-2 text-sm rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR */}
      {modalDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-sm shadow-lg animate-modal relative">
            <button
              onClick={() => setModalDelete(null)}
              className="absolute top-4 right-4 hover:bg-gray-200 dark:hover:bg-gray-800 p-1 rounded"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-bold text-red-600 mb-4">¿Eliminar compra?</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              Estás a punto de eliminar la compra del proveedor <strong>{modalDelete.supplier}</strong>.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalDelete(null)}
                className="px-4 py-2 text-sm rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animación modal */}
      <style>{`
        @keyframes modalFadeIn {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-modal {
          animation: modalFadeIn 0.25s ease forwards;
        }
        @keyframes fadeIn {
          from {opacity: 0; transform: translateY(-5px);}
          to {opacity: 1; transform: translateY(0);}
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
