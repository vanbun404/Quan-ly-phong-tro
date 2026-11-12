import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/User/home";
import AuthPage from "../Component/AuthForm";
import LoginForm from "../Component/LoginForm";
import Room from "../pages/User/SearchPage";
import BankSetupPage from "../pages/User/Landlord/BankSetupPage";

// --- Admin Pages ---
import AdminDashboard from "../pages/Admin/Dashbord";
import RoomManagement from "../pages/Admin/room_management";
import TransactionManagement from "../pages/Admin/transaction_management";
import UserManagement from "../pages/Admin/user_management";

// --- Admin Layout ---
import AdminLayout from "../layouts/AdminLayout";

// --- User Layout ---
import UserLayout from "../layouts/UserLayout";
// --- Các trang User mới (tạo sau) ---
import MyContracts from "../pages/User/my_contracts";
import SupportReport from "../pages/User/support_report";
import Payment from "../pages/User/payment";
import AddRoom from "../pages/User/Landlord/addRoom";
import NotificationPage from "../pages/User/notification";
// import ProfilePage from "../pages/User/profile";

// --- Các trang Admin mới (tạo sau) ---
import NotificationManagement from "../pages/Admin/NotificationManagement";
import Settings from "../pages/Admin/setting";
import BuildingManagement from "../pages/Admin/BuildingManagement";
import ContractManagement from "../pages/Admin/ContractManagement";

export default function AppRouter() {
  return (
    <Routes>
      {/* --- Layout cho user --- */}
      <Route element={<UserLayout />}>
       <Route path="/profile/:id/bank" element={<BankSetupPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/rooms" element={<Room />} />
        <Route path="/contracts" element={<MyContracts />} />
        <Route path="/support" element={<SupportReport />} />
        <Route path="/payments" element={<Payment />} />
        <Route path="/landlord/add-room" element={<AddRoom />} />
        <Route path="/notifications" element={<NotificationPage />} />
        {/* <Route path="/profile/:id" element={<ProfilePage />} /> */}
        {/* Thêm các route khác cho user tại đây */}
      </Route>

      {/* --- Layout cho admin --- */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/user-management" element={<UserManagement />} />
        <Route path="/admin/room-management" element={<RoomManagement />} />
        <Route
          path="/admin/transaction-management"
          element={<TransactionManagement />}
        />
        <Route
          path="/admin/notifications"
          element={<NotificationManagement />}
        />
        <Route path="/admin/settings" element={<Settings />} />
        <Route
          path="/admin/building-management"
          element={<BuildingManagement />}
        />
        <Route
          path="/admin/contract-management"
          element={<ContractManagement />}
        />
      </Route>

      {/* --- Nếu nhập sai URL thì về trang chủ --- */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
