import { Home, Users, CreditCard, FileText, Settings } from "lucide-react";

export default function Sidebar({ activeMenu, setActiveMenu }) {
  return (
    <aside className="w-64 bg-gray-800 text-gray-100 flex flex-col">
      <div className="text-2xl font-bold p-6">Quản trị</div>
      <nav className="flex-1">
        <ul className="space-y-2 px-4">
          <li
            onClick={() => setActiveMenu("Bảng điều khiển")}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
              activeMenu === "Bảng điều khiển"
                ? "bg-gray-700"
                : "hover:bg-gray-700"
            }`}
          >
            <Home size={18} /> Bảng điều khiển
          </li>
          <li
            onClick={() => setActiveMenu("Người dùng")}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
              activeMenu === "Người dùng" ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
          >
            <Users size={18} /> Quản lý người dùng
          </li>
          <li
            onClick={() => setActiveMenu("Bất động sản")}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
              activeMenu === "Bất động sản"
                ? "bg-gray-700"
                : "hover:bg-gray-700"
            }`}
          >
            <Home size={18} /> Nhà / Phòng cho thuê
          </li>
          <li
            onClick={() => setActiveMenu("Giao dịch")}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
              activeMenu === "Giao dịch" ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
          >
            <CreditCard size={18} /> Giao dịch
          </li>
          <li
            onClick={() => setActiveMenu("Báo cáo")}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
              activeMenu === "Báo cáo" ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
          >
            <FileText size={18} /> Báo cáo
          </li>
          <li
            onClick={() => setActiveMenu("Cài đặt")}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
              activeMenu === "Cài đặt" ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
          >
            <Settings size={18} /> Cài đặt
          </li>
        </ul>
      </nav>
    </aside>
  );
}
