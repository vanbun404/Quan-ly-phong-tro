import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { Users, Home, Bed, DollarSign } from "lucide-react";

export default function Dashboard() {
  const [year, setYear] = useState(2024);

  const yearlyData = {
    2023: [5, 10, 15, 20, 25, 30, 28, 35, 40, 32, 20, 15],
    2024: [25, 45, 35, 28, 32, 40, 50, 55, 42, 38, 30, 20],
    2025: [15, 25, 20, 18, 22, 28, 30, 32, 25, 27, 18, 12],
  };

  const data = Array.from({ length: 12 }, (_, i) => ({
    month: `Th${i + 1}`,
    users: yearlyData[year]?.[i] || 0,
  }));

  return (
    <main className="flex-1 p-6 md:p-8 overflow-y-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Bảng điều khiển</h1>

      {/* --- Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { title: "Tổng người dùng", value: "324", color: "bg-blue-500" },
          { title: "Tổng phòng", value: "68", color: "bg-green-500" },
          {
            title: "Doanh thu tháng",
            value: "45,200,000₫",
            color: "bg-yellow-500",
          },
          {
            title: "Hợp đồng đang hoạt động",
            value: "52",
            color: "bg-purple-500",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow p-6 flex justify-between items-center transition-transform hover:-translate-y-1 hover:shadow-lg"
          >
            <div>
              <p className="text-sm text-gray-500">{item.title}</p>
              <h2 className="text-2xl font-bold text-gray-800">{item.value}</h2>
            </div>
            <div className="text-indigo-500">{item.icon}</div>
          </div>
        ))}
      </div>

      {/* --- Chart --- */}
      <div className="bg-white shadow rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Thống kê người dùng theo tháng
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setYear((y) => (y > 2023 ? y - 1 : y))}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 transition"
            >
              ◀
            </button>
            <span className="text-lg font-semibold">{year}</span>
            <button
              onClick={() => setYear((y) => (y < 2025 ? y + 1 : y))}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 transition"
            >
              ▶
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={450}>
          <BarChart data={data} barSize={45}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#818cf8" stopOpacity={0.7} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fill: "#374151", fontSize: 14 }} />
            <YAxis tick={{ fill: "#374151", fontSize: 14 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
              cursor={{ fill: "rgba(99,102,241,0.1)" }}
            />
            <Bar
              dataKey="users"
              fill="url(#colorUsers)"
              radius={[10, 10, 0, 0]}
              activeBar={{ fill: "#4338ca" }}
            >
              <LabelList
                dataKey="users"
                position="top"
                fill="#111827"
                fontSize={13}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}
