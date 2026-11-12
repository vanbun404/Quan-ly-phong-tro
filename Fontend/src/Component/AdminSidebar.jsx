import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Home,
  DollarSign,
  Building2,
  Settings,
  Bell,
  ClipboardList,
} from "lucide-react";

export default function AdminSidebar() {
  const location = useLocation();

  const menus = [
    {
      name: "Bảng điều khiển",
      path: "/admin",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Quản lý người dùng",
      path: "/admin/user-management",
      icon: <Users size={20} />,
    },
    {
      name: "Quản lý tòa nhà",
      path: "/admin/building-management",
      icon: <Building2 size={20} />,
    },
    {
      name: "Quản lý phòng",
      path: "/admin/room-management",
      icon: <Home size={20} />,
    },
    {
      name: "Quản lý hợp đồng",
      path: "/admin/contract-management",
      icon: <ClipboardList size={20} />,
    },
    {
      name: "Quản lý giao dịch",
      path: "/admin/transaction-management",
      icon: <DollarSign size={20} />,
    },
    {
      name: "Thông báo hệ thống",
      path: "/admin/notifications",
      icon: <Bell size={20} />,
    },
    {
      name: "Cài đặt hệ thống",
      path: "/admin/settings",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <aside
      className="
        w-64 
        bg-gray-800 
        text-white 
        h-[calc(100vh-60px)]   /* kéo dài toàn bộ chiều cao trừ navbar */
        flex 
        flex-col 
        border-r 
        border-gray-200 
        shadow-md
      "
    >
      {/* --- Menu --- */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menus.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/admin" && location.pathname.startsWith(item.path));

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-indigo-500 text-white shadow-sm"
                  : "text-gray-100 hover:bg-indigo-600 hover:text-white"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* --- Footer --- */}
      <div className="p-4 text-sm text-gray-500 border-t border-gray-200">
        © 2025 Admin System
      </div>
    </aside>
  );
}
