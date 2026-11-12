import { Bell, Mail, User, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById } from "../api/userApi";

export default function AdminNavbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Lấy thông tin user từ localStorage hoặc session
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Lấy userId từ localStorage (hoặc từ context/redux)
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);

          // Gọi API để lấy thông tin mới nhất
          const response = await getUserById(userData.id);

          if (response && !response.message) {
            setUser({
              id: response.id,
              name: response.fullName || response.username || "Admin",
              email: response.email,
              avatar: response.avatar || "https://i.pravatar.cc/40",
              role: response.role || "Administrator",
            });
          } else {
            // Fallback: dùng data từ localStorage
            setUser({
              id: userData.id,
              name: userData.fullName || userData.username || "Admin",
              email: userData.email,
              avatar: userData.avatar || "https://i.pravatar.cc/40",
              role: userData.role || "Administrator",
            });
          }
        } else {
          // Không có user trong localStorage → redirect to login
          navigate("/login");
        }
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
        // Fallback: dùng data từ localStorage nếu có
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser({
            id: userData.id,
            name: userData.fullName || userData.username || "Admin",
            email: userData.email,
            avatar: userData.avatar || "https://i.pravatar.cc/40",
            role: userData.role || "Administrator",
          });
        } else {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Xóa token/session
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Chuyển về trang login
    navigate("/login");
  };

  const handleProfile = () => {
    setShowDropdown(false);
    // Chuyển đến trang profile
    navigate("/admin/profile");
  };

  // Loading state
  if (loading) {
    return (
      <nav className="bg-gray-800 px-6 py-3 flex justify-between items-center">
        <div className="text-white text-xl font-bold">Admin Panel</div>
        <div className="flex items-center gap-5">
          <div className="w-10 h-10 rounded-full bg-gray-600 animate-pulse"></div>
        </div>
      </nav>
    );
  }

  // Không có user data
  if (!user) {
    return null;
  }

  return (
    <nav className="bg-gray-800 px-6 py-3 flex justify-between items-center">
      {/* Bên trái: Logo */}
      <div className="text-white text-xl font-bold">Admin Panel</div>

      {/* Bên phải: Icon + User */}
      <div className="flex items-center gap-5">
        {/* Icon chuông */}
        <button className="text-white hover:text-gray-300 relative">
          <Bell size={22} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </button>

        {/* Icon thư */}
        <button className="text-white hover:text-gray-300 relative mr-10">
          <Mail size={22} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            5
          </span>
        </button>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-700 px-3 py-2 rounded-lg transition"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <img
              src={user.avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full border-2 border-gray-600 hover:border-indigo-500 transition"
              onError={(e) => {
                e.target.src = "https://i.pravatar.cc/40"; // Fallback nếu avatar lỗi
              }}
            />
            <span className="text-white text-lg font-semibold">
              Hi, {user.name}
            </span>
          </div>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
              {/* User Info */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-12 h-12 rounded-full border-2 border-white"
                    onError={(e) => {
                      e.target.src = "https://i.pravatar.cc/40";
                    }}
                  />
                  <div className="text-white">
                    <p className="font-bold text-lg">{user.name}</p>
                    <p className="text-xs text-gray-100">{user.email}</p>
                    <p className="text-xs text-gray-200 mt-1">{user.role}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button
                  onClick={handleProfile}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-3 text-gray-700 transition"
                >
                  <User size={18} className="text-indigo-600" />
                  <span className="font-medium">Hồ sơ cá nhân</span>
                </button>

                <div className="border-t border-gray-200 my-1"></div>

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center gap-3 text-red-600 transition"
                >
                  <LogOut size={18} />
                  <span className="font-medium">Đăng xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
