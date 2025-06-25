import { useState, useMemo } from "react";
import { Trash2, Pencil, X, User, Plus } from "lucide-react";

const regiones = ["Región Metropolitana", "Valparaíso", "Biobío"];
const ciudades = {
  "Región Metropolitana": ["Santiago", "Puente Alto", "La Florida"],
  Valparaíso: ["Valparaíso", "Viña del Mar"],
  Biobío: ["Concepción", "Talcahuano"]
};

const initialCustomers = [
  {
    id: 1,
    first_name: "Pedro",
    last_name: "Osorio",
    tax_id: "12345678-5",
    email: "pedro@mail.com",
    phone: "912345678",
    address: "Calle ejemplo 123",
    region: "Región Metropolitana",
    city: "Santiago",
    customer_type: "persona",
    status: "activo"
  },
  {
    id: 2,
    first_name: "Maria",
    last_name: "Gonzalez",
    tax_id: "98765432-1",
    email: "maria@mail.com",
    phone: "987654321",
    address: "Av. Libertad 456",
    region: "Valparaíso",
    city: "Viña del Mar",
    customer_type: "empresa",
    status: "inactivo"
  }
];

export default function Customers() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [modalCreate, setModalCreate] = useState(false);
  const [modalEdit, setModalEdit] = useState(null);
  const [modalView, setModalView] = useState(null);
  const [modalDelete, setModalDelete] = useState(null);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    tax_id: "",
    email: "",
    phone: "",
    address: "",
    region: "",
    city: "",
    customer_type: "persona",
    status: "activo"
  });
  const [errors, setErrors] = useState({});

  const filteredCustomers = useMemo(() => {
    if (!search) return customers;
    return customers.filter(c =>
      [c.first_name, c.last_name, c.tax_id, c.email, c.phone]
        .some(field => field.toLowerCase().includes(search.toLowerCase()))
    );
  }, [customers, search]);

  const resetForm = () => {
    setForm({
      first_name: "",
      last_name: "",
      tax_id: "",
      email: "",
      phone: "",
      address: "",
      region: "",
      city: "",
      customer_type: "persona",
      status: "activo"
    });
    setErrors({});
  };

  const validate = () => {
    const errs = {};
    if (!form.first_name) errs.first_name = "El nombre es obligatorio";
    if (!form.last_name) errs.last_name = "El apellido es obligatorio";
    if (!form.tax_id) errs.tax_id = "El RUT es obligatorio";
    else if (!/^\d{7,8}-[0-9kK]$/.test(form.tax_id))
      errs.tax_id = "Formato RUT inválido (ej: 12345678-5)";
    if (!form.email) errs.email = "El email es obligatorio";
    else if (
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)
    )
      errs.email = "Email inválido";
    if (!form.phone) errs.phone = "El teléfono es obligatorio";
    else if (!/^\d{7,9}$/.test(form.phone))
      errs.phone = "Teléfono inválido (solo números, 7-9 dígitos)";
    if (!form.address) errs.address = "La dirección es obligatoria";
    if (!form.region) errs.region = "La región es obligatoria";
    if (!form.city) errs.city = "La ciudad es obligatoria";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;
    const newCustomer = { ...form, id: Date.now() };
    setCustomers([...customers, newCustomer]);
    setModalCreate(false);
    resetForm();
  };

  const handleUpdate = () => {
    if (!validate()) return;
    setCustomers(
      customers.map(c =>
        c.id === modalEdit.id ? { ...modalEdit, ...form } : c
      )
    );
    setModalEdit(null);
    resetForm();
  };

  const handleDelete = () => {
    setCustomers(customers.filter(c => c.id !== modalDelete.id));
    setModalDelete(null);
  };

  const openEditModal = customer => {
    setModalEdit(customer);
    setForm({ ...customer });
    setErrors({});
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 w-full min-h-[500px]">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <User size={24} /> Clientes
        </h2>
        <button
          onClick={() => {
            resetForm();
            setModalCreate(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm font-semibold flex items-center gap-1"
        >
          <Plus size={16} /> Crear Cliente
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar clientes..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4 px-3 py-1.5 w-full border rounded dark:bg-gray-800 dark:text-white text-sm"
      />

      <div className="overflow-x-auto w-full">
        <table className="w-full text-sm text-left table-auto">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase tracking-wide">
            <tr>
              <th className="py-4 px-4">Nombre</th>
              <th className="py-4 px-4">RUT</th>
              <th className="py-4 px-4">Email</th>
              <th className="py-4 px-4">Teléfono</th>
              <th className="py-4 px-4">Región</th>
              <th className="py-4 px-4">Ciudad</th>
              <th className="py-4 px-4">Tipo</th>
              <th className="py-4 px-4">Estado</th>
              <th className="py-4 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredCustomers.map(customer => (
              <tr
                key={customer.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="py-3 px-4 text-gray-900 dark:text-white text-sm">
                  {customer.first_name} {customer.last_name}
                </td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 text-sm">
                  {customer.tax_id}
                </td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 text-sm">
                  {customer.email}
                </td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 text-sm">
                  {customer.phone}
                </td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 text-sm">
                  {customer.region}
                </td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 text-sm">
                  {customer.city}
                </td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-300 text-sm capitalize">
                  {customer.customer_type}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={
                      customer.status === "activo"
                        ? "text-green-600 font-semibold"
                        : "text-red-600 font-semibold"
                    }
                  >
                    {customer.status}
                  </span>
                </td>
                <td className="py-3 px-4 flex gap-2 flex-wrap">
                  <button
                    onClick={() => setModalView(customer)}
                    className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1 px-3 py-2 rounded-md text-white transition text-sm"
                    aria-label="Ver cliente"
                  >
                    <User size={14} />
                    Ver
                  </button>
                  <button
                    onClick={() => openEditModal(customer)}
                    className="bg-yellow-400 hover:bg-yellow-500 flex items-center gap-1 px-3 py-2 rounded-md text-black transition text-sm"
                    aria-label="Editar cliente"
                  >
                    <Pencil size={14} />
                    Editar
                  </button>
                  <button
                    onClick={() => setModalDelete(customer)}
                    className="bg-red-700 hover:bg-red-600 flex items-center gap-1 px-3 py-2 rounded-md text-white transition text-sm"
                    aria-label="Eliminar cliente"
                  >
                    <Trash2 size={14} />
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL CREAR/EDITAR MÁS GRANDE */}
      {(modalCreate || modalEdit) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 p-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-8 w-full max-w-3xl max-h-[90vh] overflow-auto shadow-lg animate-modal relative">
            <button
              onClick={() => {
                setModalCreate(false);
                setModalEdit(null);
                resetForm();
              }}
              className="absolute top-4 right-4 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
              aria-label="Cerrar modal"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              {modalCreate ? "Nuevo Cliente" : `Editar ${modalEdit.first_name} ${modalEdit.last_name}`}
            </h3>

            <form
              onSubmit={e => {
                e.preventDefault();
                modalCreate ? handleCreate() : handleUpdate();
              }}
              className="space-y-4 text-sm"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Nombre</label>
                  <input
                    type="text"
                    value={form.first_name}
                    onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                    className={`w-full px-3 py-1.5 border rounded bg-white dark:bg-gray-800 text-black dark:text-white text-sm ${errors.first_name ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.first_name && <p className="text-red-500 text-xs mt-0.5">{errors.first_name}</p>}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Apellido</label>
                  <input
                    type="text"
                    value={form.last_name}
                    onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
                    className={`w-full px-3 py-1.5 border rounded bg-white dark:bg-gray-800 text-black dark:text-white text-sm ${errors.last_name ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.last_name && <p className="text-red-500 text-xs mt-0.5">{errors.last_name}</p>}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">RUT</label>
                  <input
                    type="text"
                    value={form.tax_id}
                    onChange={e => setForm(f => ({ ...f, tax_id: e.target.value }))}
                    className={`w-full px-3 py-1.5 border rounded bg-white dark:bg-gray-800 text-black dark:text-white text-sm ${errors.tax_id ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.tax_id && <p className="text-red-500 text-xs mt-0.5">{errors.tax_id}</p>}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className={`w-full px-3 py-1.5 border rounded bg-white dark:bg-gray-800 text-black dark:text-white text-sm ${errors.email ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-0.5">{errors.email}</p>}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className={`w-full px-3 py-1.5 border rounded bg-white dark:bg-gray-800 text-black dark:text-white text-sm ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-0.5">{errors.phone}</p>}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Dirección</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    className={`w-full px-3 py-1.5 border rounded bg-white dark:bg-gray-800 text-black dark:text-white text-sm ${errors.address ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-0.5">{errors.address}</p>}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Región</label>
                  <select
                    value={form.region}
                    onChange={e => {
                      setForm(f => ({ ...f, region: e.target.value, city: "" }));
                    }}
                    className={`w-full px-3 py-1.5 border rounded bg-white dark:bg-gray-800 text-black dark:text-white text-sm ${errors.region ? "border-red-500" : "border-gray-300"}`}
                  >
                    <option value="">Selecciona región</option>
                    {regiones.map(r => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  {errors.region && <p className="text-red-500 text-xs mt-0.5">{errors.region}</p>}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Ciudad</label>
                  <select
                    value={form.city}
                    onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    disabled={!form.region}
                    className={`w-full px-3 py-1.5 border rounded bg-white dark:bg-gray-800 text-black dark:text-white text-sm ${errors.city ? "border-red-500" : "border-gray-300"}`}
                  >
                    <option value="">Selecciona ciudad</option>
                    {form.region &&
                      ciudades[form.region].map(c => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                  {errors.city && <p className="text-red-500 text-xs mt-0.5">{errors.city}</p>}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Tipo Cliente</label>
                  <select
                    value={form.customer_type}
                    onChange={e => setForm(f => ({ ...f, customer_type: e.target.value }))}
                    className="w-full px-3 py-1.5 border rounded bg-white dark:bg-gray-800 text-black dark:text-white text-sm"
                  >
                    <option value="persona">Persona</option>
                    <option value="empresa">Empresa</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Estado</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full px-3 py-1.5 border rounded bg-white dark:bg-gray-800 text-black dark:text-white text-sm"
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (modalCreate) setModalCreate(false);
                    else setModalEdit(null);
                    resetForm();
                  }}
                  className="px-4 py-1.5 rounded border border-gray-400 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded text-sm"
                >
                  {modalCreate ? "Crear" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL VER */}
      {modalView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-lg animate-modal relative overflow-auto max-h-[90vh]">
            <button
              onClick={() => setModalView(null)}
              className="absolute top-4 right-4 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
              aria-label="Cerrar modal"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Detalle cliente
            </h3>
            <div className="space-y-2 text-sm text-gray-800 dark:text-gray-200">
              <p>
                <strong>Nombre:</strong> {modalView.first_name} {modalView.last_name}
              </p>
              <p>
                <strong>RUT:</strong> {modalView.tax_id}
              </p>
              <p>
                <strong>Email:</strong> {modalView.email}
              </p>
              <p>
                <strong>Teléfono:</strong> {modalView.phone}
              </p>
              <p>
                <strong>Dirección:</strong> {modalView.address}
              </p>
              <p>
                <strong>Región:</strong> {modalView.region}
              </p>
              <p>
                <strong>Ciudad:</strong> {modalView.city}
              </p>
              <p>
                <strong>Tipo:</strong> {modalView.customer_type}
              </p>
              <p>
                <strong>Estado:</strong> {modalView.status}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR */}
      {modalDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-sm shadow-lg animate-modal relative">
            <button
              onClick={() => setModalDelete(null)}
              className="absolute top-4 right-4 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
              aria-label="Cerrar modal"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Confirmar eliminación
            </h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              ¿Estás seguro de eliminar al cliente{" "}
              <strong>
                {modalDelete.first_name} {modalDelete.last_name}
              </strong>
              ?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalDelete(null)}
                className="px-4 py-1.5 rounded border border-gray-400 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded text-sm"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeSlideDown {
          0% {
            opacity: 0;
            transform: translateY(-15px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-modal {
          animation: fadeSlideDown 0.25s ease forwards;
        }
      `}</style>
    </div>
  );
}
