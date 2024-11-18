"use client"

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
  { date: "2024-01", queries: 400, satisfaction: 75 },
  { date: "2024-02", queries: 300, satisfaction: 78 },
  { date: "2024-03", queries: 600, satisfaction: 82 },
  { date: "2024-04", queries: 800, satisfaction: 88 },
  { date: "2024-05", queries: 1000, satisfaction: 92 },
]

export default function EmbeddableChart() {
  return (
    <div className="space-y-6 p-8">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          User Engagement Analytics
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Since implementing our chat feature in January 2024, we&apos;ve
          observed a significant upward trend in both user engagement and
          satisfaction metrics. The chart below demonstrates a consistent
          increase in query volume, growing from 400 monthly queries to over
          1,000 by May, while user satisfaction scores have climbed from 75% to
          92%.
        </p>
      </div>

      <div className="w-full h-[400px] bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#666" }}
              axisLine={{ stroke: "#e0e0e0" }}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: "#666" }}
              axisLine={{ stroke: "#e0e0e0" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              tick={{ fill: "#666" }}
              axisLine={{ stroke: "#e0e0e0" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #f0f0f0",
                borderRadius: "6px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            />
            <Legend verticalAlign="top" height={36} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="queries"
              name="Monthly Queries"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ strokeWidth: 2, fill: "#6366f1" }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="satisfaction"
              name="User Satisfaction (%)"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ strokeWidth: 2, fill: "#22c55e" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="max-w-3xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Key Insights
        </h3>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>
            Query volume has increased by{" "}
            <span className="font-medium text-indigo-600">150%</span> over 5
            months
          </li>
          <li>
            User satisfaction has shown a steady improvement, reaching an
            all-time high of{" "}
            <span className="font-medium text-green-600">92%</span>
          </li>
          <li>
            The correlation between increased usage and satisfaction suggests
            strong product-market fit
          </li>
        </ul>
      </div>
    </div>
  )
}
