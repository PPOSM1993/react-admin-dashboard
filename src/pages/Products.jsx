import { useState, useMemo } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  Plus,
  Box,
  ArrowUpDown
} from "lucide-react";

const initialProducts = [
  {
    id: 1,
    name: "Libro de React",
    price: 19990,
    category: "Libros",
    stock: 12,
    status: "activo"
  },
  {
    id: 2,
    name: "Curso de Tailwind",
    price: 9990,
    category: "Cursos",
    stock: 8,
    status: "inactivo"
  },
  {
    id: 3,
    name: "Laptop Acer",
    price: 499990,
    category: "Tecnología",
    stock: 4,
    status: "activo"
  }
];

const statusColors = {
  activo: "text-green-600",
  inactivo: "text-red-600"
};

const categories = ["Libros", "Cursos", "Tecnología", "Electrónica", "Accesorios"];

export default function Products() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [modalView, setModalView] = useState(null);
  const [modalEdit, setModalEdit] = useState(null);
  const [modalDelete, setModalDelete] = useState(null);
  const [modalCreate, setModalCreate] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", category: "", stock: "", status: "activo" });
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;


  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesName = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = filterCategory ? p.category === filterCategory : true;
      const matchesStatus = filterStatus ? p.status === filterStatus : true;
      return matchesName && matchesCategory && matchesStatus;
    });
  }, [products, search, filterCategory, filterStatus]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredProducts, sortBy, sortDirection]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedProducts, currentPage]);

  // Validaciones más estrictas
  const validateForm = () => {
    const errs = {};
    if (!form.name.trim()) {
      errs.name = "El nombre es obligatorio";
    } else if (form.name.trim().length < 3) {
      errs.name = "El nombre debe tener al menos 3 caracteres";
    }

    if (!form.price) {
      errs.price = "El precio es obligatorio";
    } else if (isNaN(Number(form.price)) || Number(form.price) <= 0) {
      errs.price = "El precio debe ser un número positivo";
    } else if (!Number.isInteger(Number(form.price))) {
      errs.price = "El precio debe ser un número entero";
    }

    if (!form.stock && form.stock !== 0) {
      errs.stock = "El stock es obligatorio";
    } else if (isNaN(Number(form.stock)) || Number(form.stock) < 0) {
      errs.stock = "El stock debe ser un número igual o mayor que 0";
    } else if (!Number.isInteger(Number(form.stock))) {
      errs.stock = "El stock debe ser un número entero";
    }

    if (!form.category) {
      errs.category = "La categoría es obligatoria";
    }

    if (!["activo", "inactivo"].includes(form.status)) {
      errs.status = "Estado inválido";
    }

    return errs;
  };

  const handleCreate = () => {
    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const newProduct = {
      ...form,
      id: Date.now(),
      price: Number(form.price),
      stock: Number(form.stock),
    };
    setProducts([...products, newProduct]);
    setModalCreate(false);
    setForm({ name: "", price: "", category: "", stock: "", status: "activo" });
    setErrors({});
  };

  const handleUpdate = () => {
    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setProducts(
      products.map((p) =>
        p.id === modalEdit.id
          ? { ...modalEdit, ...form, price: Number(form.price), stock: Number(form.stock) }
          : p
      )
    );
    setModalEdit(null);
    setForm({ name: "", price: "", category: "", stock: "", status: "activo" });
    setErrors({});
  };

  const handleDelete = () => {
    setProducts(products.filter((p) => p.id !== modalDelete.id));
    setModalDelete(null);
  };

  const openEditModal = (product) => {
    setModalEdit(product);
    setForm({ name: product.name, price: product.price, category: product.category, stock: product.stock, status: product.status });
    setErrors({});
  };

  // Clases comunes para inputs pequeños
  const inputSmallClass = "w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm";

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Box size={22} /> Productos
        </h2>
        <button
          onClick={() => {
            setModalCreate(true);
            setForm({ name: "", price: "", category: "", stock: "", status: "activo" });
            setErrors({});
          }}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 text-white font-semibold rounded-lg px-3 py-1.5 shadow-md transition text-sm"
        >
          <Plus size={16} /> Agregar
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow min-w-[200px] px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
        />
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="min-w-[160px] px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
        >
          <option value="" disabled hidden>Seleccionar categoría</option>
          <option value="">Todas las categorías</option>
          {[...new Set(products.map(p => p.category))].map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="min-w-[140px] px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
        >
          <option value="" disabled hidden>Seleccionar estado</option>
          <option value="">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase tracking-wide">
            <tr>
              <th
                className="py-4 px-5 cursor-pointer select-none"
                onClick={() => {
                  if (sortBy === "name") setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                  else {
                    setSortBy("name");
                    setSortDirection("asc");
                  }
                }}
              >
                <div className="flex items-center gap-1">
                  Nombre <ArrowUpDown size={14} />
                  {sortBy === "name" && (
                    <span>{sortDirection === "asc" ? "▲" : "▼"}</span>
                  )}
                </div>
              </th>
              <th
                className="py-4 px-5 cursor-pointer select-none"
                onClick={() => {
                  if (sortBy === "price") setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                  else {
                    setSortBy("price");
                    setSortDirection("asc");
                  }
                }}
              >
                <div className="flex items-center gap-1">
                  Precio <ArrowUpDown size={14} />
                  {sortBy === "price" && (
                    <span>{sortDirection === "asc" ? "▲" : "▼"}</span>
                  )}
                </div>
              </th>
              <th className="py-4 px-5">Categoría</th>
              <th className="py-4 px-5">Stock</th>
              <th className="py-4 px-5">Estado</th>
              <th className="py-4 px-5">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500 dark:text-gray-400">No se encontraron productos</td>
              </tr>
            ) : (
              paginatedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-4 px-5 text-gray-800 dark:text-white">{product.name}</td>
                  <td className="py-4 px-5 text-gray-700 dark:text-gray-200">${product.price.toLocaleString()}</td>
                  <td className="py-4 px-5 text-gray-700 dark:text-gray-200">{product.category}</td>
                  <td className="py-4 px-5 text-gray-700 dark:text-gray-200">{product.stock}</td>
                  <td className="py-4 px-5">
                    <span className={`text-sm font-medium ${statusColors[product.status]}`}>{product.status}</span>
                  </td>
                  <td className="py-4 px-5 flex gap-2 flex-wrap">
                    <button
                      onClick={() => setModalView(product)}
                      className="flex items-center gap-1 px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                      aria-label={`Ver ${product.name}`}
                    >
                      <Eye size={16} /> View
                    </button>
                    <button
                      onClick={() => openEditModal(product)}
                      className="bg-yellow-400 hover:bg-yellow-500 flex items-center gap-1 px-3 py-2 rounded-md transition text-black"
                      aria-label={`Editar ${product.name}`}
                    >
                      <Pencil size={16} /> Edit
                    </button>
                    <button
                      onClick={() => setModalDelete(product)}
                      className="bg-red-600 hover:bg-red-700 flex items-center gap-1 px-3 py-2 rounded-md transition text-white"
                      aria-label={`Eliminar ${product.name}`}
                    >

                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 text-sm text-gray-600 dark:text-gray-300">
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>


      {/* Modal Crear/Editar sin animación ni blur */}
      {(modalCreate || modalEdit) && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
              {modalCreate ? "Nuevo Producto" : `Editar ${modalEdit.name}`}
            </h3>
            <div className="space-y-3">
              <div>
                <input
                  name="name"
                  placeholder="Nombre"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className={inputSmallClass}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <input
                  name="price"
                  placeholder="Precio"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  className={inputSmallClass}
                  inputMode="numeric"
                />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              </div>
              <div>
                <select
                  name="category"
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className={inputSmallClass}
                >
                  <option value="">Seleccione una categoría</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </div>
              <div>
                <input
                  name="stock"
                  placeholder="Stock"
                  value={form.stock}
                  onChange={e => setForm({ ...form, stock: e.target.value })}
                  className={inputSmallClass}
                  inputMode="numeric"
                />
                {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
              </div>
              <select
                name="status"
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                className={inputSmallClass}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
              {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setModalCreate(false);
                  setModalEdit(null);
                  setErrors({});
                }}
                className="text-sm px-3 py-1.5 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={modalCreate ? handleCreate : handleUpdate}
                className="text-sm px-3 py-1.5 rounded bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ver información */}
      {modalView && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Información del Producto</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li><strong>Nombre:</strong> {modalView.name}</li>
              <li><strong>Precio:</strong> ${modalView.price.toLocaleString()}</li>
              <li><strong>Categoría:</strong> {modalView.category}</li>
              <li><strong>Stock:</strong> {modalView.stock}</li>
              <li><strong>Estado:</strong> {modalView.status}</li>
            </ul>
            <div className="mt-6 text-right">
              <button
                onClick={() => setModalView(null)}
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {modalDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-red-600 mb-4">¿Eliminar producto?</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              Estás a punto de eliminar <strong>{modalDelete.name}</strong>.
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
          </div>
        </div>
      )}
    </div>
  );
}
