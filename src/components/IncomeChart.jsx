import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Ene", income: 2400 },
  { month: "Feb", income: 3000 },
  { month: "Mar", income: 2000 },
  { month: "Abr", income: 2780 },
  { month: "May", income: 1890 },
  { month: "Jun", income: 2390 },
  { month: "Jul", income: 3490 },
];

// Tooltip personalizado para mejor estilo y dark mode
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded shadow-lg border border-gray-200 dark:border-gray-600">
        <p className="font-semibold">{label}</p>
        <p>Ingresos: <span className="font-bold">${payload[0].value.toLocaleString()}</span></p>
      </div>
    );
  }
  return null;
};

export default function IncomeChart() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md max-w-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Ingresos Mensuales
      </h2>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
          <XAxis
            dataKey="month"
            stroke="#4f46e5"
            tickLine={false}
            axisLine={{ stroke: "#c7d2fe" }}
            style={{ fontWeight: 600 }}
          />
          <YAxis
            tickLine={false}
            axisLine={{ stroke: "#c7d2fe" }}
            tickFormatter={value => `$${value / 1000}k`}
            style={{ fontWeight: 600 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#4f46e5", strokeWidth: 2 }} />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#4f46e5"
            strokeWidth={4}
            dot={{ r: 6, strokeWidth: 2, stroke: "#4f46e5", fill: "#fff" }}
            activeDot={{ r: 8 }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
