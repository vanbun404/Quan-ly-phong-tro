import AdminNavbar from "../Component/AdminNavbar";
import AdminSidebar from "../Component/AdminSidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* --- Navbar trên cùng --- */}
      <AdminNavbar />

      {/* --- Phần dưới gồm sidebar + nội dung --- */}
      <div className="flex flex-1 overflow-y-auto">
        {/* Sidebar bên trái */}
        <AdminSidebar />

        {/* Nội dung chính */}
        <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
