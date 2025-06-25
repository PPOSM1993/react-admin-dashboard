import { User, DollarSign, Activity } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { title: "Usuarios", value: "245", icon: User, color: "from-blue-400 to-blue-600 bg-gradient-to-tr text-white" },
  { title: "Ingresos", value: "$8.450", icon: DollarSign, color: "from-green-400 to-green-600 bg-gradient-to-tr text-white" },
  { title: "Activos hoy", value: "53", icon: Activity, color: "from-purple-400 to-purple-600 bg-gradient-to-tr text-white" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      type: "spring",
      stiffness: 100,
    },
  }),
};

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
      {stats.map(({ title, value, icon: Icon, color }, idx) => (
        <motion.div
          key={idx}
          role="region"
          aria-label={`${title}: ${value}`}
          className="p-6 rounded-3xl shadow-lg bg-white dark:bg-gray-800 flex items-center gap-6 cursor-default"
          custom={idx}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.12)" }}
          whileTap={{ scale: 0.95 }}
        >
          <div className={`flex items-center justify-center w-16 h-16 rounded-full shadow-md ${color}`}>
            <Icon size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
