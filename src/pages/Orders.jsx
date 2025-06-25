import { useState, useMemo } from "react";
import { X, Eye, Pencil, Trash2, Plus, ArrowUpDown } from "lucide-react";

const initialOrders = [
  {
    id: 1,
    order_number: "PED001",
    customer_name: "Juan Pérez",
    date: "2025-06-20",
    status: "pendiente",
    total: 120000,
    items_count: 3,
  },
  {
    id: 2,
    order_number: "PED002",
    customer_name: "María López",
    date: "2025-06-21",
    status: "completado",
    total: 250000,
    items_count: 5,
  },
  {
    id: 3,
    order_number: "PED003",
    customer_name: "Carlos Gómez",
    date: "2025-06-22",
    status: "cancelado",
    total: 50000,
    items_count: 1,
  },
];

const statusColors = {
  pendiente: "text-yellow-500",
  completado: "text-green-600",
  cancelado: "text-red-600",
};

export default function Orders() {
  const [orders, setOrders] = useState(initialOrders);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [sortBy, setSortBy] = useState("order_number");
  const [sortDirection, setSortDirection] = useState("asc");

  const [modalView, setModalView] = useState(null);
  const [modalEdit, setModalEdit] = useState(null);
  const [modalDelete, setModalDelete] = useState(null);
  const [modalCreate, setModalCreate] = useState(false);

  const [form, setForm] = useState({
    order_number: "",
    customer_name: "",
    date: "",
    status: "pendiente",
    total: "",
    items_count: "",
  });

  const [errors, setErrors] = useState({});

  // Filtrado combinado con rango de fechas
  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => {
        const matchText =
          o.order_number.toLowerCase().includes(searchText.toLowerCase()) ||
          o.customer_name.toLowerCase().includes(searchText.toLowerCase());

        const matchStatus = filterStatus ? o.status === filterStatus : true;

        let matchDate = true;
        if (filterDateFrom) {
          matchDate = matchDate && o.date >= filterDateFrom;
        }
        if (filterDateTo) {
          matchDate = matchDate && o.date <= filterDateTo;
        }

        return matchText && matchStatus && matchDate;
      })
      .sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
  }, [orders, searchText, filterStatus, filterDateFrom, filterDateTo, sortBy, sortDirection]);

  // Validaciones simples para formulario
  const validateForm = () => {
    const newErrors = {};
    if (!form.order_number.trim()) newErrors.order_number = "Número de pedido requerido";
    if (!form.customer_name.trim()) newErrors.customer_name = "Nombre del cliente requerido";
    if (!form.date) newErrors.date = "Fecha requerida";
    if (!form.total || isNaN(form.total) || Number(form.total) <= 0)
      newErrors.total = "Total debe ser mayor a 0";
    if (!form.items_count || isNaN(form.items_count) || Number(form.items_count) <= 0)
      newErrors.items_count = "Ítems debe ser mayor a 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearForm = () => {
    setForm({
      order_number: "",
      customer_name: "",
      date: "",
      status: "pendiente",
      total: "",
      items_count: "",
    });
    setErrors({});
  };

  const handleCreate = () => {
    if (!validateForm()) return;
    const newOrder = { ...form, id: Date.now() };
    setOrders([...orders, newOrder]);
    setModalCreate(false);
    clearForm();
  };

  const handleUpdate = () => {
    if (!validateForm()) return;
    setOrders(
      orders.map((o) => (o.id === modalEdit.id ? { ...modalEdit, ...form } : o))
    );
    setModalEdit(null);
    clearForm();
  };

  const handleDelete = () => {
    setOrders(orders.filter((o) => o.id !== modalDelete.id));
    setModalDelete(null);
  };

  const openEditModal = (order) => {
    setModalEdit(order);
    setForm({
      order_number: order.order_number,
      customer_name: order.customer_name,
      date: order.date,
      status: order.status,
      total: order.total,
      items_count: order.items_count,
    });
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 flex-wrap">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Plus size={22} /> Pedidos
        </h2>
        <button
          onClick={() => {
            setModalCreate(true);
            clearForm();
          }}
          className="bg-green-500 text-white px-3 py-1.5 rounded-md hover:bg-green-600 text-sm flex items-center gap-1"
        >
          <Plus size={16} /> Nuevo Pedido
        </button>
      </div>

      {/* FILTROS */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 flex-wrap items-center">
        <input
          type="text"
          placeholder="Buscar por número o cliente..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="flex-1 min-w-[200px] px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-48 px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="completado">Completado</option>
          <option value="cancelado">Cancelado</option>
        </select>

        <div className="flex gap-2 items-center">
          <label className="text-gray-700 dark:text-gray-300 text-sm">Desde:</label>
          <input
            type="date"
            value={filterDateFrom}
            onChange={(e) => setFilterDateFrom(e.target.value)}
            className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        <div className="flex gap-2 items-center">
          <label className="text-gray-700 dark:text-gray-300 text-sm">Hasta:</label>
          <input
            type="date"
            value={filterDateTo}
            onChange={(e) => setFilterDateTo(e.target.value)}
            className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase tracking-wide">
            <tr>
              <th
                className="py-3 px-5 cursor-pointer select-none"
                onClick={() => toggleSort("order_number")}
              >
                <div className="flex items-center gap-1">
                  Número <ArrowUpDown size={14} />
                </div>
              </th>
              <th
                className="py-3 px-5 cursor-pointer select-none"
                onClick={() => toggleSort("customer_name")}
              >
                <div className="flex items-center gap-1">
                  Cliente <ArrowUpDown size={14} />
                </div>
              </th>
              <th
                className="py-3 px-5 cursor-pointer select-none"
                onClick={() => toggleSort("date")}
              >
                <div className="flex items-center gap-1">
                  Fecha <ArrowUpDown size={14} />
                </div>
              </th>
              <th
                className="py-3 px-5 cursor-pointer select-none"
                onClick={() => toggleSort("status")}
              >
                <div className="flex items-center gap-1">
                  Estado <ArrowUpDown size={14} />
                </div>
              </th>
              <th
                className="py-3 px-5 cursor-pointer select-none"
                onClick={() => toggleSort("total")}
              >
                <div className="flex items-center gap-1">
                  Total <ArrowUpDown size={14} />
                </div>
              </th>
              <th
                className="py-3 px-5 cursor-pointer select-none"
                onClick={() => toggleSort("items_count")}
              >
                <div className="flex items-center gap-1">
                  Ítems <ArrowUpDown size={14} />
                </div>
              </th>
              <th className="py-3 px-5">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-700 dark:text-gray-300">
                  No hay pedidos que coincidan con los filtros.
                </td>
              </tr>
            )}
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="py-3 px-5 text-gray-800 dark:text-white">{order.order_number}</td>
                <td className="py-3 px-5 text-gray-700 dark:text-gray-200">{order.customer_name}</td>
                <td className="py-3 px-5 text-gray-700 dark:text-gray-200">{order.date}</td>
                <td className="py-3 px-5">
                  <span className={`capitalize text-sm font-medium ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-5 text-gray-700 dark:text-gray-200">${order.total.toLocaleString()}</td>
                <td className="py-3 px-5 text-gray-700 dark:text-gray-200">{order.items_count}</td>
                <td className="py-3 px-5 flex gap-2 flex-wrap">
                  <button
                    onClick={() => setModalView(order)}
                    className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1 px-3 py-2 rounded-md text-white transition text-sm"
                    title="Ver"
                  >
                    <Eye size={16} /> Ver
                  </button>
                  <button
                    onClick={() => openEditModal(order)}
                    className="bg-yellow-400 hover:bg-yellow-500 flex items-center gap-1 px-3 py-2 rounded-md text-black transition text-sm"
                    title="Editar"
                  >
                    <Pencil size={16} /> Editar
                  </button>
                  <button
                    onClick={() => setModalDelete(order)}
                    className="bg-red-700 hover:bg-red-600 flex items-center gap-1 px-3 py-2 rounded-md text-white transition text-sm"
                    title="Eliminar"
                  >
                    <Trash2 size={16} /> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL CREAR / EDITAR */}
      {(modalCreate || modalEdit) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-xl shadow-lg animate-modal relative">
            <button
              onClick={() => {
                setModalCreate(false);
                setModalEdit(null);
                setErrors({});
              }}
              className="absolute top-4 right-4 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition"
              aria-label="Cerrar modal"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              {modalCreate ? "Nuevo Pedido" : `Editar Pedido ${modalEdit.order_number}`}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
                  Número de pedido
                </label>
                <input
                  type="text"
                  value={form.order_number}
                  onChange={(e) => setForm({ ...form, order_number: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.order_number ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                  }`}
                  placeholder="PED001"
                />
                {errors.order_number && (
                  <p className="text-red-500 text-xs mt-1">{errors.order_number}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
                  Cliente
                </label>
                <input
                  type="text"
                  value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.customer_name ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                  }`}
                  placeholder="Juan Pérez"
                />
                {errors.customer_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.customer_name}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
                  Fecha
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.date ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                  }`}
                />
                {errors.date && (
                  <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
                  Estado
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="completado">Completado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
                  Total
                </label>
                <input
                  type="number"
                  value={form.total}
                  onChange={(e) => setForm({ ...form, total: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.total ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                  }`}
                  min="1"
                  step="any"
                  placeholder="120000"
                />
                {errors.total && (
                  <p className="text-red-500 text-xs mt-1">{errors.total}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
                  Ítems
                </label>
                <input
                  type="number"
                  value={form.items_count}
                  onChange={(e) => setForm({ ...form, items_count: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.items_count ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                  }`}
                  min="1"
                  placeholder="3"
                />
                {errors.items_count && (
                  <p className="text-red-500 text-xs mt-1">{errors.items_count}</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setModalCreate(false);
                  setModalEdit(null);
                  setErrors({});
                }}
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={modalCreate ? handleCreate : handleUpdate}
                className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 text-sm"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL VER PEDIDO */}
      {modalView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-lg animate-modal relative">
            <button
              onClick={() => setModalView(null)}
              className="absolute top-4 right-4 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition"
              aria-label="Cerrar modal"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Detalles del Pedido
            </h3>

            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li><strong>Número:</strong> {modalView.order_number}</li>
              <li><strong>Cliente:</strong> {modalView.customer_name}</li>
              <li><strong>Fecha:</strong> {modalView.date}</li>
              <li><strong>Estado:</strong> {modalView.status}</li>
              <li><strong>Total:</strong> ${modalView.total.toLocaleString()}</li>
              <li><strong>Ítems:</strong> {modalView.items_count}</li>
            </ul>

            <div className="mt-6 text-right">
              <button
                onClick={() => setModalView(null)}
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 text-sm"
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
              className="absolute top-4 right-4 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition"
              aria-label="Cerrar modal"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-red-600 mb-4">
              ¿Eliminar pedido?
            </h3>

            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              Estás a punto de eliminar el pedido <strong>{modalDelete.order_number}</strong>.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalDelete(null)}
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-sm"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalFadeIn {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-modal {
          animation: modalFadeIn 0.25s ease forwards;
        }
      `}</style>
    </div>
  );
}
