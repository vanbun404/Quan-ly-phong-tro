import { Pencil, Trash2 } from "lucide-react";

export default function TransactionManagement() {
  const transactions = [
    {
      id: 1,
      user: "Nguyễn Văn A",
      room: "Phòng 101",
      amount: "2.500.000đ",
      date: "2025-09-05",
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Quản lý giao dịch</h2>

      <table className="w-full border-collapse bg-white rounded-lg shadow-md">
        <thead className="bg-indigo-600 text-white">
          <tr>
            <th className="p-3 text-left">Người giao dịch</th>
            <th className="p-3 text-left">Phòng</th>
            <th className="p-3 text-left">Số tiền</th>
            <th className="p-3 text-left">Ngày</th>
            <th className="p-3 text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="border-b hover:bg-gray-100">
              <td className="p-3">{t.user}</td>
              <td className="p-3">{t.room}</td>
              <td className="p-3">{t.amount}</td>
              <td className="p-3">{t.date}</td>
              <td className="p-3 text-center space-x-3">
                <button className="text-indigo-500 hover:text-indigo-700">
                  <Pencil size={18} />
                </button>
                <button className="text-red-500 hover:text-red-700">
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
