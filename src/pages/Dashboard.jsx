import StatsCards from "../components/StatCard";
import IncomeChart from "../components/IncomeChart";
import RecentUsersTable from "../components/RecentUsersTable";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <StatsCards />
      <IncomeChart />
      <RecentUsersTable />
    </div>
  );
}