import { useState, useMemo } from "react";
import { FileText, Eye, Trash2, Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const initialInvoices = [
    {
        id: 1,
        number: "INV-1001",
        customer: "Pedro Osorio",
        date: "2025-06-01",
        total: 19990,
        status: "pagada"
    },
    {
        id: 2,
        number: "INV-1002",
        customer: "Lucía Rojas",
        date: "2025-06-10",
        total: 29990,
        status: "pendiente"
    }
];

const statusColors = {
    pagada: "text-green-600",
    pendiente: "text-yellow-500",
    vencida: "text-red-600"
};

export default function Invoices() {
    const [invoices, setInvoices] = useState(initialInvoices);
    const [search, setSearch] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [modalView, setModalView] = useState(null);

    const filteredInvoices = useMemo(() => {
        return invoices.filter((inv) => {
            const matchesSearch =
                inv.customer.toLowerCase().includes(search.toLowerCase()) ||
                inv.number.toLowerCase().includes(search.toLowerCase());
            const matchesDate = dateFilter ? inv.date === dateFilter : true;
            return matchesSearch && matchesDate;
        });
    }, [invoices, search, dateFilter]);

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
                    className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-lg shadow-xl relative"
                >
                    {children}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );

    return (
        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
            <div className="flex flex-col mb-6 gap-4">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                    <FileText size={22} /> Facturas
                </h2>
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                    <input
                        type="text"
                        placeholder="Buscar factura..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="px-2 py-1.5 flex-grow border rounded dark:bg-gray-800 dark:text-white text-sm"
                    />
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="px-3 py-1.5 w-full border rounded dark:bg-gray-800 dark:text-white text-sm"
                    />
                </div>
            </div>


            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 uppercase">
                        <tr>
                            <th className="px-4 py-3">N°</th>
                            <th className="px-4 py-3">Cliente</th>
                            <th className="px-4 py-3">Fecha</th>
                            <th className="px-4 py-3">Total</th>
                            <th className="px-4 py-3">Estado</th>
                            <th className="px-4 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredInvoices.map((inv) => (
                            <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <td className="px-4 py-3">{inv.number}</td>
                                <td className="px-4 py-3">{inv.customer}</td>
                                <td className="px-4 py-3">{inv.date}</td>
                                <td className="px-4 py-3">${inv.total.toLocaleString()}</td>
                                <td className="px-4 py-3">
                                    <span className={`font-medium ${statusColors[inv.status]}`}>{inv.status}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <button
                                        onClick={() => setModalView(inv)}
                                        className="bg-blue-500 text-white p-1.5 rounded hover:bg-blue-600"
                                    >
                                        <Eye size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modalView && (
                <ModalWrapper onClose={() => setModalView(null)}>
                    <button
                        onClick={() => setModalView(null)}
                        className="absolute top-4 right-4 hover:bg-gray-200 dark:hover:bg-gray-800 p-1 rounded"
                    >
                        <X size={18} />
                    </button>
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Detalles de la Factura</h3>
                    <ul className="text-sm text-gray-800 dark:text-gray-200 space-y-1">
                        <li><strong>N°:</strong> {modalView.number}</li>
                        <li><strong>Cliente:</strong> {modalView.customer}</li>
                        <li><strong>Fecha:</strong> {modalView.date}</li>
                        <li><strong>Total:</strong> ${modalView.total.toLocaleString()}</li>
                        <li><strong>Estado:</strong> {modalView.status}</li>
                    </ul>
                </ModalWrapper>
            )}
        </div>
    );
}
