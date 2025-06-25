import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, ShieldCheck, ShoppingCart, Package, List,
  User2, ClipboardList, CreditCard, Truck, FileText, DollarSign,
  BarChart2, ClipboardCheck, LifeBuoy, Briefcase, CalendarCheck,
  Boxes, RefreshCw, UserCircle, Settings, X
} from "lucide-react";
import { motion } from "framer-motion";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/users", label: "Usuarios", icon: Users },
  { to: "/roles", label: "Roles y permisos", icon: ShieldCheck },
  { to: "/sales", label: "Ventas", icon: ShoppingCart },
  { to: "/products", label: "Productos", icon: Package },
  { to: "/categories", label: "Categorías", icon: List },
  { to: "/customers", label: "Clientes", icon: User2 },
  { to: "/orders", label: "Pedidos", icon: ClipboardList },
  { to: "/purchases", label: "Compras", icon: CreditCard },
  { to: "/suppliers", label: "Proveedores", icon: Truck },
  { to: "/invoices", label: "Facturas", icon: FileText },
  { to: "/payments", label: "Pagos", icon: DollarSign },
  { to: "/reports", label: "Reportes", icon: BarChart2 },
  { to: "/work-orders", label: "Órdenes de trabajo", icon: ClipboardCheck },
  { to: "/tickets", label: "Tickets de soporte", icon: LifeBuoy },
  { to: "/staff", label: "Trabajadores", icon: Briefcase },
  { to: "/attendance", label: "Asistencia", icon: CalendarCheck },
  { to: "/inventory", label: "Inventario", icon: Boxes },
  { to: "/stock-movements", label: "Movimientos de stock", icon: RefreshCw },
  { to: "/profile", label: "Mi perfil", icon: UserCircle },
  { to: "/settings", label: "Configuraciones", icon: Settings },
];

export default function Sidebar({ open, setOpen, collapsed }) {
  const { pathname } = useLocation();
  const width = collapsed ? "w-20" : "w-64";

  return (
    <>
      {/* Overlay para móvil */}
      <div
        className={`sm:hidden fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity duration-300 ${open ? "block" : "hidden"}`}
        onClick={() => setOpen(false)}
      ></div>

      <aside
        className={`fixed top-0 left-0 z-40 h-full bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 shadow-md
        transform transition-all duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0 ${width} flex flex-col`}
      >
        {/* Header */}
        <div className={`flex items-center px-4 h-16 border-b border-gray-200 dark:border-gray-800 text-indigo-700 dark:text-indigo-400 transition-all duration-300 ${collapsed ? "justify-center text-xl font-bold" : "text-2xl font-extrabold"}`}>
          {collapsed ? "A" : "Admin Pro"}
          <button onClick={() => setOpen(false)} className="sm:hidden ml-auto text-gray-600 dark:text-gray-300 hover:text-red-500">
            <X size={20} />
          </button>
        </div>

        {/* Nav Scrollable */}
        <nav className="flex-1 overflow-y-auto no-scrollbar px-2 py-3">
          {links.map(({ to, label, icon: Icon }) => {
            const isActive = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => window.innerWidth < 640 && setOpen(false)}
                className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all
                ${isActive
                  ? "bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-white border-l-4 border-indigo-700 dark:border-indigo-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
              >
                <motion.span whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Icon size={20} />
                </motion.span>
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="hidden sm:flex items-center justify-center h-12 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
          {!collapsed && <span>&copy; {new Date().getFullYear()} Admin Pro</span>}
        </div>
      </aside>
    </>
  );
}
