import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, LogOut, Settings, CreditCard } from "lucide-react";
import axios from "axios";
import { getNotifications } from "../api/notificationApi";
import logo from "../assets/imgs/logo.png";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // 🧠 Load user và fetch thông báo
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchUnreadCount(parsedUser.id);
    }
  }, []);

  // 📡 Lấy số thông báo chưa đọc
  const fetchUnreadCount = async (userId) => {
    try {
      const response = await getNotifications(userId);
      if (response.success) {
        const unread = response.data.notifications.filter(
          (n) => !n.isRead
        ).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error("Lỗi khi fetch thông báo:", error);
      setUnreadCount(0);
    }
  };

  // 🧹 Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setShowDropdown(false);
    navigate("/login");
  };

  // ✍️ Upload chữ ký
  const handleSignatureUpload = async (file) => {
    if (!file || !user) return;

    try {
      const formData = new FormData();
      formData.append("signature", file);
      formData.append("id", user.id);
      formData.append("role", user.role);

      const response = await axios.post(
        "http://localhost:3000/signatures/upload", // ⚠️ đổi port nếu backend khác
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("✅ Upload chữ ký thành công!");
      const updatedUser = {
        ...user,
        signaturePath: response.data.signatureUrl,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error("❌ Lỗi khi tải chữ ký:", error);
      alert(error.response?.data?.message || "Lỗi khi tải chữ ký lên máy chủ!");
    }
  };

  // 🖱️ Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest(".dropdown-container")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  // 🧭 Điều hướng menu
  const handleNav = (path) => {
    navigate(path);
  };

  return (
    <nav className="bg-[#0B121B] shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* 🧩 Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <img src={logo} alt="Logo" className="h-10 w-auto" />
          <span className="text-2xl font-bold text-gray-200">
            <span className="text-2xl text-teal-400">N</span>hóm 9
          </span>
        </div>

        {/* 🧭 Menu */}
        <div className="hidden md:flex space-x-8">
          <button
            onClick={() => handleNav("/")}
            className="text-gray-200 hover:text-blue-400 transition"
          >
            Trang chủ
          </button>
          <button
            onClick={() => handleNav("/rooms")}
            className="text-gray-200 hover:text-blue-400 transition"
          >
            Tìm kiếm
          </button>
          <button
            onClick={() => handleNav("/contracts")}
            className="text-gray-200 hover:text-blue-400 transition"
          >
            Hợp đồng
          </button>
          <button
            onClick={() => handleNav("/support")}
            className="text-gray-200 hover:text-blue-400 transition"
          >
            Liên hệ
          </button>
          <button
            onClick={() => handleNav("/payments")}
            className="text-gray-200 hover:text-blue-400 transition"
          >
            Thanh toán
          </button>

          {user?.role === "LANDLORD" && (
            <button
              onClick={() => handleNav("/landlord/add-room")}
              className="text-gray-200 hover:text-blue-400 transition"
            >
              Thêm phòng
            </button>
          )}
        </div>

        {/* 👤 User */}
        <div className="hidden md:flex items-center space-x-4">
          {!user ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 text-sm text-white border border-blue-600 rounded-lg hover:bg-blue-700 transition"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-2 text-sm border border-blue-600 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Đăng ký
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              {/* 🔔 Thông báo */}
              <button
                onClick={() => handleNav("/notifications")}
                className="relative p-2 hover:bg-gray-700 rounded-full transition group"
                title="Thông báo"
              >
                <Bell className="w-6 h-6 text-gray-200 group-hover:text-blue-400 transition" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* 👤 Dropdown */}
              <div className="relative dropdown-container">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-700 rounded-lg transition group"
                >
                  <img
                    src={
                      user.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.name
                      )}&background=4F46E5&color=fff`
                    }
                    alt={user.name}
                    className="w-10 h-10 rounded-full border-2 border-gray-600 group-hover:border-blue-400 transition object-cover"
                  />
                  <span className="text-gray-200 font-semibold group-hover:text-blue-400 transition">
                    {user.name}
                  </span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-800">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <span
                        className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded ${
                          user.role === "ADMIN"
                            ? "bg-red-100 text-red-700"
                            : user.role === "LANDLORD"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {user.role === "ADMIN"
                          ? "👑 Admin"
                          : user.role === "LANDLORD"
                          ? "🏠 Chủ trọ"
                          : "👤 Người thuê"}
                      </span>
                    </div>

                    {/* Hồ sơ */}
                    <button
                      onClick={() => {
                        navigate(`/profile/${user.id}`);
                        setShowDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left text-gray-700 hover:bg-blue-50 flex items-center gap-3 group"
                    >
                      <User className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                      <span className="font-medium group-hover:text-blue-600">
                        Hồ sơ cá nhân
                      </span>
                    </button>

                    {/* 💳 Thêm thẻ ngân hàng */}
                    {user.role === "LANDLORD" && (
                      <button
                        onClick={() => {
                          navigate(`/profile/${user.id}/bank`);
                          setShowDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left text-gray-700 hover:bg-green-50 flex items-center gap-3 group"
                      >
                        <CreditCard className="w-5 h-5 text-gray-500 group-hover:text-green-600" />
                        <span className="font-medium group-hover:text-green-600">
                          Thêm thẻ ngân hàng
                        </span>
                      </button>
                    )}

                    {/* 🖋️ Upload chữ ký cho cả USER và LANDLORD */}
                    {(user.role === "LANDLORD" || user.role === "USER") && (
                      <>
                        <button
                          onClick={() =>
                            document.getElementById("signatureInput").click()
                          }
                          className="w-full px-4 py-3 text-left text-gray-700 hover:bg-blue-50 flex items-center gap-3 group"
                        >
                          <Settings className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                          <span className="font-medium group-hover:text-blue-600">
                            {user.signaturePath
                              ? "Cập nhật chữ ký"
                              : "Thêm chữ ký"}
                          </span>
                        </button>

                        <input
                          id="signatureInput"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleSignatureUpload(e.target.files[0])
                          }
                        />

                        {user.signaturePath && (
                          <div className="border-t border-gray-200 mt-2 px-4 py-3 text-center">
                            <p className="text-sm text-gray-700 mb-2 font-medium">
                              Chữ ký của bạn:
                            </p>
                            <img
                              src={user.signaturePath}
                              alt="Chữ ký"
                              className="w-32 mx-auto border rounded-md shadow-sm object-contain"
                            />
                          </div>
                        )}
                      </>
                    )}

                    {/* Đăng xuất */}
                    <div className="border-t border-gray-200 mt-2"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 flex items-center gap-3 group"
                    >
                      <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
