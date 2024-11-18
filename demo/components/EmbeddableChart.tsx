import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const data = [
  { date: "2024-01", queries: 400 },
  { date: "2024-02", queries: 300 },
  { date: "2024-03", queries: 600 },
  { date: "2024-04", queries: 800 },
  { date: "2024-05", queries: 1000 },
]

export default function EmbeddableChart() {
  return (
    <div className="w-full h-[400px] p-4 bg-white rounded-lg shadow-lg">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="queries"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
