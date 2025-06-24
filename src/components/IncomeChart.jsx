import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const data = [
  { month: 'Ene', ingresos: 4000 },
  { month: 'Feb', ingresos: 3000 },
  { month: 'Mar', ingresos: 5000 },
  { month: 'Abr', ingresos: 4000 },
  { month: 'May', ingresos: 6000 },
  { month: 'Jun', ingresos: 7000 },
];

export default function IncomeChart() {
  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Ingresos Mensuales</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="ingresos" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}