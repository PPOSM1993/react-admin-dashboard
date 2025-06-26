import { useState, useMemo } from "react";
import { Plus, Eye, Trash2, Truck, X, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const initialSuppliers = [
  {
    id: 1,
    name: "Tech Distribuidora",
    email: "ventas@techdistribuidora.cl",
    phone: "+56 9 8888 9999",
    tax_id: "76.123.456-7",
    address: "Av. Alameda 123, Santiago",
    status: "activo"
  },
  {
    id: 2,
    name: "Librería Central",
    email: "contacto@libreriacentral.cl",
    phone: "+56 9 7777 6666",
    tax_id: "77.765.432-1",
    address: "Calle Libros 456, Valparaíso",
    status: "inactivo"
  }
];

const statusColors = {
  activo: "text-green-600",
  inactivo: "text-red-600"
};

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modalView, setModalView] = useState(null);
  const [modalCreate, setModalCreate] = useState(false);
  const [modalEdit, setModalEdit] = useState(null);
  const [modalDelete, setModalDelete] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    tax_id: "",
    address: "",
    status: "activo"
  });
  const [errors, setErrors] = useState({});

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      const matchName = s.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter ? s.status === statusFilter : true;
      return matchName && matchStatus;
    });
  }, [suppliers, search, statusFilter]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Nombre requerido";
    if (!form.email) newErrors.email = "Correo requerido";
    if (!form.tax_id) newErrors.tax_id = "RUT requerido";
    if (!form.phone) newErrors.phone = "Teléfono requerido";
    if (!form.address) newErrors.address = "Dirección requerida";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    if (!validateForm()) return;
    const newSupplier = { ...form, id: Date.now() };
    setSuppliers([...suppliers, newSupplier]);
    setModalCreate(false);
    setForm({ name: "", email: "", phone: "", tax_id: "", address: "", status: "activo" });
    setErrors({});
  };

  const handleUpdate = () => {
    if (!validateForm()) return;
    const updated = suppliers.map((s) =>
      s.id === modalEdit.id ? { ...modalEdit, ...form } : s
    );
    setSuppliers(updated);
    setModalEdit(null);
    setForm({ name: "", email: "", phone: "", tax_id: "", address: "", status: "activo" });
    setErrors({});
  };

  const handleDelete = () => {
    setSuppliers(suppliers.filter((s) => s.id !== modalDelete.id));
    setModalDelete(null);
  };

  const ModalWrapper = ({ children, onClose }) => (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-2xl shadow-xl relative"
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  const renderFormModal = (isEdit = false) => (
    <ModalWrapper onClose={() => { isEdit ? setModalEdit(null) : setModalCreate(false); setErrors({}); }}>
      <button onClick={() => { isEdit ? setModalEdit(null) : setModalCreate(false); setErrors({}); }} className="absolute top-4 right-4 hover:bg-gray-200 dark:hover:bg-gray-800 p-1 rounded">
        <X size={18} />
      </button>
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">{isEdit ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`px-3 py-2 border rounded dark:bg-gray-800 dark:text-white ${errors.name && "border-red-500"}`} />
        <input placeholder="Correo" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={`px-3 py-2 border rounded dark:bg-gray-800 dark:text-white ${errors.email && "border-red-500"}`} />
        <input placeholder="Teléfono" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={`px-3 py-2 border rounded dark:bg-gray-800 dark:text-white ${errors.phone && "border-red-500"}`} />
        <input placeholder="RUT" value={form.tax_id} onChange={(e) => setForm({ ...form, tax_id: e.target.value })} className={`px-3 py-2 border rounded dark:bg-gray-800 dark:text-white ${errors.tax_id && "border-red-500"}`} />
        <input placeholder="Dirección" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={`col-span-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-white ${errors.address && "border-red-500"}`} />
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="col-span-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-white">
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <button onClick={isEdit ? handleUpdate : handleCreate} className="px-4 py-2 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700">
          {isEdit ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </ModalWrapper>
  );

  const renderViewModal = () => (
    <ModalWrapper onClose={() => setModalView(null)}>
      <button onClick={() => setModalView(null)} className="absolute top-4 right-4 hover:bg-gray-200 dark:hover:bg-gray-800 p-1 rounded">
        <X size={18} />
      </button>
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Detalles del Proveedor</h3>
      <ul className="text-sm text-gray-800 dark:text-gray-200 space-y-1">
        <li><strong>Nombre:</strong> {modalView.name}</li>
        <li><strong>Correo:</strong> {modalView.email}</li>
        <li><strong>Teléfono:</strong> {modalView.phone}</li>
        <li><strong>RUT:</strong> {modalView.tax_id}</li>
        <li><strong>Dirección:</strong> {modalView.address}</li>
        <li><strong>Estado:</strong> {modalView.status}</li>
      </ul>
    </ModalWrapper>
  );

  const renderDeleteModal = () => (
    <ModalWrapper onClose={() => setModalDelete(null)}>
      <button onClick={() => setModalDelete(null)} className="absolute top-4 right-4 hover:bg-gray-200 dark:hover:bg-gray-800 p-1 rounded">
        <X size={18} />
      </button>
      <h3 className="text-lg font-bold text-red-600 mb-4">Eliminar Proveedor</h3>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">Estás seguro de eliminar <strong>{modalDelete.name}</strong>?</p>
      <div className="flex justify-end gap-2">
        <button onClick={() => setModalDelete(null)} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300">Cancelar</button>
        <button onClick={handleDelete} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Eliminar</button>
      </div>
    </ModalWrapper>
  );

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
          <Truck size={22} /> Proveedores
        </h2>
        <button
          onClick={() => setModalCreate(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded"
        >
          <Plus size={16} /> Nuevo Proveedor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 px-3 py-1.5 w-full border rounded dark:bg-gray-800 dark:text-white text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="mb-4 px-3 py-1.5 w-full border rounded dark:bg-gray-800 dark:text-white text-sm"
        >
          <option value="">Filtrar por estado</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 uppercase">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Correo</th>
              <th className="px-4 py-3">Teléfono</th>
              <th className="px-4 py-3">RUT</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredSuppliers.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-4 py-3">{s.name}</td>
                <td className="px-4 py-3">{s.email}</td>
                <td className="px-4 py-3">{s.phone}</td>
                <td className="px-4 py-3">{s.tax_id}</td>
                <td className="px-4 py-3">
                  <span className={`font-medium ${statusColors[s.status]}`}>{s.status}</span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => setModalView(s)} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1 px-3 py-2 rounded-md text-white transition text-sm">
                    <Eye size={16} /> Ver
                  </button>
                  <button onClick={() => {
                    setModalEdit(s);
                    setForm({ ...s });
                  }} className="bg-yellow-400 hover:bg-yellow-500 flex items-center gap-1 px-3 py-2 rounded-md transition text-black">
                    <Pencil size={16} /> Edit
                  </button>
                  <button onClick={() => setModalDelete(s)} className="flex items-center gap-1 px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition text-sm">
                    <Trash2 size={16} /> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalCreate && renderFormModal(false)}
      {modalEdit && renderFormModal(true)}
      {modalView && renderViewModal()}
      {modalDelete && renderDeleteModal()}
    </div>
  );
}