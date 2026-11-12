import { useState, useEffect } from "react";
import { Pencil, Trash2, Search } from "lucide-react";
import { getAllAccounts } from "../../api/userApi";

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách user, landlord, admin từ API khi load trang
  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      try {
        const data = await getAllAccounts();
        setAccounts(data || []);
      } catch (err) {
        setAccounts([]);
      }
      setLoading(false);
    };
    fetchAccounts();
  }, []);

  // Chuyển đổi role/type từ backend sang tiếng Việt
  const getRoleLabel = (role, type) => {
    if (type === "ADMIN" || role === "ADMIN") return "Admin";
    if (type === "LANDLORD" || role === "LANDLORD") return "Chủ trọ";
    if (type === "USER" || role === "USER") return "Người thuê";
    return type || role;
  };

  // Hàm chọn màu nền cho từng vai trò
  const getRoleStyle = (role) => {
    switch (role) {
      case "Admin":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Chủ trọ":
        return "bg-green-100 text-green-800 border-green-300";
      case "Người thuê":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  // Lọc account theo search
  const filteredAccounts = accounts.filter(
    (u) =>
      (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* --- Header + Search --- */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <h2 className="text-2xl font-bold text-indigo-700">
          Quản lý tài khoản
        </h2>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* --- Table --- */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full border-collapse bg-white">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-3 text-left">Họ tên</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Vai trò</th>
              <th className="p-3 text-left">Ngày tạo</th>
              <th className="p-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  Đang tải danh sách tài khoản...
                </td>
              </tr>
            ) : filteredAccounts.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  Không tìm thấy tài khoản nào.
                </td>
              </tr>
            ) : (
              filteredAccounts.map((u) => (
                <tr
                  key={u.id + (u.type || u.role)}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3">{u.name || "(Chưa đặt tên)"}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 text-sm font-medium border rounded-full ${getRoleStyle(
                        getRoleLabel(u.role, u.type)
                      )}`}
                    >
                      {getRoleLabel(u.role, u.type)}
                    </span>
                  </td>
                  <td className="p-3">
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString("vi-VN")
                      : ""}
                  </td>
                  <td className="p-3 text-center space-x-3">
                    <button className="text-indigo-500 hover:text-indigo-700">
                      <Pencil size={18} />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
