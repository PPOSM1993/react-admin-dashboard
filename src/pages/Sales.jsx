import { useState, useMemo } from "react";
import {
    Eye,
    Pencil,
    Trash2,
    Plus,
    X,
    Menu,
    FileDown,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const statusOptions = ["Pending", "Paid", "Shipped", "Cancelled"];
const shippingMethods = ["Store Pickup", "Standard Shipping", "Express Shipping"];

const initialSales = [
    {
        id: 1,
        customer: "Juan Pérez",
        products: ["Libro A", "Libro B"],
        quantity: 2,
        total: 20000,
        payment: "Transferencia",
        date: "2025-06-25",
        shippingAddress: "Av. Siempre Viva 123",
        phone: "+56 9 1234 5678",
        status: "Paid",
        notes: "Deliver before 6 PM",
        couponCode: "DESC10",
        taxPercent: 19,
        shippingMethod: "Standard Shipping",
    },
];

export default function Sales() {
    const [sales, setSales] = useState(initialSales);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterShipping, setFilterShipping] = useState("");
    const [filterDateFrom, setFilterDateFrom] = useState("");
    const [filterDateTo, setFilterDateTo] = useState("");

    const [modalView, setModalView] = useState(null);
    const [modalCreate, setModalCreate] = useState(false);
    const [modalEdit, setModalEdit] = useState(null);
    const [showTable, setShowTable] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [form, setForm] = useState({
        customer: "",
        products: "",
        quantity: 1,
        total: 0,
        payment: "",
        date: "",
        shippingAddress: "",
        phone: "",
        status: "Pending",
        notes: "",
        couponCode: "",
        taxPercent: 19,
        shippingMethod: shippingMethods[0],
        finalTotal: 0,
    });

    const enrichedSales = useMemo(() => {
        return sales.map((sale) => {
            const taxAmount = (sale.total * sale.taxPercent) / 100;
            const discount = sale.couponCode?.match(/^DESC(\d{1,2})$/)
                ? (sale.total * parseInt(sale.couponCode.replace("DESC", ""), 10)) / 100
                : 0;
            const finalTotal = sale.total + taxAmount - discount;
            return {
                ...sale,
                taxAmount,
                discount,
                finalTotal,
            };
        });
    }, [sales]);

    // Filtered & searched sales
    const filteredSales = enrichedSales.filter((s) => {
        const matchSearch = s.customer.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus ? s.status === filterStatus : true;
        const matchShipping = filterShipping ? s.shippingMethod === filterShipping : true;
        const matchDateFrom = filterDateFrom ? s.date >= filterDateFrom : true;
        const matchDateTo = filterDateTo ? s.date <= filterDateTo : true;
        return matchSearch && matchStatus && matchShipping && matchDateFrom && matchDateTo;
    });

    const paginatedSales = filteredSales.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredSales.length / itemsPerPage);

    const handleCreate = () => {
        const newSale = {
            ...form,
            id: Date.now(),
            products: form.products.split(",").map((p) => p.trim()),
        };
        setSales([newSale, ...sales]);
        resetForm();
        setModalCreate(false);
    };

    const resetForm = () => {
        setForm({
            customer: "",
            products: "",
            quantity: 1,
            total: 0,
            payment: "",
            date: "",
            shippingAddress: "",
            phone: "",
            status: "Pending",
            notes: "",
            couponCode: "",
            taxPercent: 19,
            shippingMethod: shippingMethods[0],
            finalTotal: 0,
        });
    };

    const openEditModal = (sale) => {
        setForm({ ...sale, products: sale.products.join(", ") });
        setModalEdit(sale);
    };

    const handleEdit = () => {
        setSales((prev) =>
            prev.map((s) =>
                s.id === modalEdit.id
                    ? { ...form, id: s.id, products: form.products.split(",").map((p) => p.trim()) }
                    : s
            )
        );
        setModalEdit(null);
        resetForm();
    };

    const handleExport = () => {
        const csv = [
            [
                "Customer",
                "Products",
                "Quantity",
                "Payment",
                "Date",
                "Status",
                "Final Total",
            ],
            ...enrichedSales.map((s) => [
                s.customer,
                s.products.join(" / "),
                s.quantity,
                s.payment,
                s.date,
                s.status,
                s.finalTotal,
            ]),
        ]
            .map((row) => row.join(","))
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "sales.csv";
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const confirmDelete = (saleId) => {
        if (window.confirm("Are you sure you want to delete this sale?")) {
            setSales((prev) => prev.filter((v) => v.id !== saleId));
        }
    };

    const ModalView = ({ sale, onClose }) => (
        <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-lg relative"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-red-600"
                    aria-label="Close"
                >
                    <X size={24} />
                </button>
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                    Sale Details
                </h3>
                <div className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                    <p>
                        <strong>Customer:</strong> {sale.customer}
                    </p>
                    <p>
                        <strong>Products:</strong> {sale.products.join(", ")}
                    </p>
                    <p>
                        <strong>Quantity:</strong> {sale.quantity}
                    </p>
                    <p>
                        <strong>Base Total:</strong> ${sale.total.toLocaleString()}
                    </p>
                    <p>
                        <strong>Tax:</strong> ${sale.taxAmount.toLocaleString()}
                    </p>
                    <p>
                        <strong>Discount:</strong> ${sale.discount.toLocaleString()}
                    </p>
                    <p>
                        <strong>Final Total:</strong> ${sale.finalTotal.toLocaleString()}
                    </p>
                    <p>
                        <strong>Payment Method:</strong> {sale.payment}
                    </p>
                    <p>
                        <strong>Shipping Address:</strong> {sale.shippingAddress}
                    </p>
                    <p>
                        <strong>Phone:</strong> {sale.phone}
                    </p>
                    <p>
                        <strong>Status:</strong> {sale.status}
                    </p>
                    <p>
                        <strong>Date:</strong> {sale.date}
                    </p>
                    <p>
                        <strong>Notes:</strong> {sale.notes}
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md max-w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Sales</h2>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={handleExport}
                        className="bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded text-sm flex items-center gap-1"
                    >
                        <FileDown size={16} /> Export
                    </button>
                    <button
                        onClick={() => setShowTable(!showTable)}
                        className="bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded text-sm flex items-center gap-1"
                    >
                        <Menu size={16} /> {showTable ? "Hide" : "Show"} Table
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search customer..."
                    className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"

                />
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"

                >
                    <option value="">All Statuses</option>
                    {statusOptions.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
                <select
                    value={filterShipping}
                    onChange={(e) => setFilterShipping(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"

                >
                    <option value="">All Shipping Methods</option>
                    {shippingMethods.map((method) => (
                        <option key={method} value={method}>
                            {method}
                        </option>
                    ))}
                </select>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
                    <input
                        type="date"
                        value={filterDateFrom}
                        onChange={(e) => setFilterDateFrom(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                        placeholder="From Date"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
                    <input
                        type="date"
                        value={filterDateTo}
                        onChange={(e) => setFilterDateTo(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                        placeholder="To Date"
                    />
                </div>

            </div>

            {showTable && (
                <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 text-base">
                            <tr>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Products</th>
                                <th className="px-6 py-4">Quantity</th>
                                <th className="px-6 py-4">Payment</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Final Total</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-gray-700">
                            {paginatedSales.map((s) => (
                                <tr
                                    key={s.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                    <td className="px-6 py-3">{s.customer}</td>
                                    <td className="px-6 py-3">{s.products.join(", ")}</td>
                                    <td className="px-6 py-3">{s.quantity}</td>
                                    <td className="px-6 py-3">{s.payment}</td>
                                    <td className="px-6 py-3">{s.date}</td>
                                    <td className="px-6 py-3">{s.status}</td>
                                    <td className="px-6 py-3">${s.finalTotal.toLocaleString()}</td>
                                    <td className="px-6 py-3 flex flex-wrap gap-3">
                                        <button
                                            onClick={() => setModalView(s)}
                                            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1 px-3 py-2 rounded-md text-white transition text-sm"
                                        >
                                            <Eye size={18} /> View
                                        </button>
                                        <button
                                            onClick={() => openEditModal(s)}
                                            className="bg-yellow-400 hover:bg-yellow-500 flex items-center gap-1 px-3 py-2 rounded-md text-black transition text-sm"
                                        >
                                            <Pencil size={18} /> Edit
                                        </button>
                                        <button
                                            onClick={() => confirmDelete(s.id)}
                                            className="flex items-center gap-1 px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition text-sm"
                                        >
                                            <Trash2 size={18} /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {paginatedSales.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="text-center px-6 py-6 text-gray-500 dark:text-gray-400"
                                    >
                                        No sales found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-4 py-2 rounded ${currentPage === i + 1
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}

            <div className="flex justify-end mt-6">
                <button
                    onClick={() => setModalCreate(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm flex items-center gap-2"
                >
                    <Plus size={18} /> New Sale
                </button>
            </div>

            <AnimatePresence>
                {modalCreate && (
                    <ModalForm
                        title="Create Sale"
                        onClose={() => setModalCreate(false)}
                        onSubmit={handleCreate}
                        submitText="Save"
                        form={form}
                        setForm={setForm}
                    />
                )}
                {modalEdit && (
                    <ModalForm
                        title="Edit Sale"
                        onClose={() => setModalEdit(null)}
                        onSubmit={handleEdit}
                        submitText="Save Changes"
                        form={form}
                        setForm={setForm}
                    />
                )}
                {modalView && <ModalView sale={modalView} onClose={() => setModalView(null)} />}
            </AnimatePresence>
        </div>
    );
}

const ModalForm = ({ title, onClose, onSubmit, submitText, form, setForm }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]:
                name === "quantity" || name === "total" || name === "taxPercent"
                    ? Number(value)
                    : value,
        });
    };
    return (
        <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-2xl relative"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-red-600"
                    aria-label="Close"
                >
                    <X size={24} />
                </button>
                <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
                    {title}
                </h3>
                <form
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit();
                    }}
                >
                    <input
                        name="customer"
                        value={form.customer}
                        onChange={handleChange}
                        required
                        placeholder="Customer"
                        className="text-base px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        name="products"
                        value={form.products}
                        onChange={handleChange}
                        required
                        placeholder="Products (comma separated)"
                        className="text-base px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        name="quantity"
                        type="number"
                        value={form.quantity}
                        onChange={handleChange}
                        required
                        placeholder="Quantity"
                        className="text-base px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min={1}
                    />
                    <input
                        name="total"
                        type="number"
                        value={form.total}
                        onChange={handleChange}
                        required
                        placeholder="Base Total"
                        className="text-base px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min={0}
                        step={0.01}
                    />
                    <input
                        name="payment"
                        value={form.payment}
                        onChange={handleChange}
                        required
                        placeholder="Payment Method"
                        className="text-base px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        name="date"
                        type="date"
                        value={form.date}
                        onChange={handleChange}
                        required
                        className="text-base px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        name="shippingAddress"
                        value={form.shippingAddress}
                        onChange={handleChange}
                        placeholder="Shipping Address"
                        className="text-base px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Phone"
                        className="text-base px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="text-base px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {statusOptions.map((status) => (
                            <option key={status}>{status}</option>
                        ))}
                    </select>
                    <select
                        name="shippingMethod"
                        value={form.shippingMethod}
                        onChange={handleChange}
                        className="text-base px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {shippingMethods.map((m) => (
                            <option key={m}>{m}</option>
                        ))}
                    </select>
                    <input
                        name="couponCode"
                        value={form.couponCode}
                        onChange={handleChange}
                        placeholder="Coupon (e.g. DESC10)"
                        className="text-base px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        name="taxPercent"
                        type="number"
                        value={form.taxPercent}
                        onChange={handleChange}
                        placeholder="% Tax"
                        className="text-base px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min={0}
                        max={100}
                        step={0.1}
                    />
                    <textarea
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        placeholder="Notes"
                        className="text-base px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-md w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 col-span-2 resize-y"
                        rows={3}
                    ></textarea>
                    <button
                        type="submit"
                        className="col-span-2 mt-4 px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 text-lg"
                    >
                        {submitText}
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
};
