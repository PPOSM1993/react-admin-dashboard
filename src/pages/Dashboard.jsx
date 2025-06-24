import StatCard from "../components/StatCard";
import { FaDollarSign, FaUsers, FaShoppingCart } from "react-icons/fa";
import IncomeChart from "../components/IncomeChart";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Ventas" value="$12.000" icon={<FaDollarSign />} />
        <StatCard title="Clientes" value="540" icon={<FaUsers />} />
        <StatCard title="Órdenes" value="120" icon={<FaShoppingCart />} />
      </div>
      <IncomeChart />
    </div>
  );
}
