export default function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded shadow p-4 flex items-center gap-4">
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-gray-600">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
