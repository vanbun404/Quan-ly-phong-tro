import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Edit2,
  Camera,
  Save,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { getUserById, updateUser } from "../../api/userApi";

export default function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    avatar: "",
  });

  // Avatar preview
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Fetch user data
  useEffect(() => {
    fetchUserProfile();
  }, [id]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentUser = JSON.parse(localStorage.getItem("user"));

      // Kiểm tra quyền truy cập
      if (currentUser.id !== id && currentUser.role !== "ADMIN") {
        setError("Bạn không có quyền xem hồ sơ này");
        return;
      }

      const response = await getUserById(id);

      if (response.success) {
        setUser(response.data.user);
        setFormData({
          name: response.data.user.name,
          phone: response.data.user.phone || "",
          avatar: response.data.user.avatar || "",
        });
      } else {
        setError(response.message || "Không thể tải thông tin người dùng");
      }
    } catch (err) {
      console.error("Lỗi khi fetch user:", err);
      setError("Có lỗi xảy ra khi tải thông tin");
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // TODO: Upload to Cloudinary
      // uploadToCloudinary(file).then(url => {
      //   setFormData(prev => ({ ...prev, avatar: url }));
      // });
    }
  };

  // Handle save
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage("");

      const response = await updateUser(id, formData);

      if (response.success) {
        setUser(response.data.user);

        // Update localStorage
        const currentUser = JSON.parse(localStorage.getItem("user"));
        localStorage.setItem(
          "user",
          JSON.stringify({ ...currentUser, ...response.data.user })
        );

        setSuccessMessage("Cập nhật thông tin thành công!");
        setIsEditing(false);

        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(response.message || "Không thể cập nhật thông tin");
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      setError("Có lỗi xảy ra khi cập nhật");
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData({
      name: user.name,
      phone: user.phone || "",
      avatar: user.avatar || "",
    });
    setAvatarPreview(null);
    setIsEditing(false);
    setError(null);
  };

  // Role badge config
  const getRoleBadge = (role) => {
    const config = {
      ADMIN: { color: "bg-red-100 text-red-700", icon: "👑", label: "Admin" },
      LANDLORD: {
        color: "bg-green-100 text-green-700",
        icon: "🏠",
        label: "Chủ trọ",
      },
      USER: {
        color: "bg-blue-100 text-blue-700",
        icon: "👤",
        label: "Người thuê",
      },
    };
    return config[role] || config.USER;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Lỗi</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  const roleBadge = getRoleBadge(user.role);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-700 font-medium">{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32"></div>

          {/* Avatar Section */}
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={
                    avatarPreview ||
                    user.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name
                    )}&background=4F46E5&color=fff&size=200`
                  }
                  alt={user.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition shadow-lg">
                    <Camera className="w-5 h-5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="text-3xl font-bold text-gray-800 bg-gray-50 border-2 border-indigo-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-600 w-full"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-gray-800">
                    {user.name}
                  </h1>
                )}

                <div className="flex items-center gap-3 mt-2 justify-center md:justify-start">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${roleBadge.color}`}
                  >
                    <span>{roleBadge.icon}</span>
                    {roleBadge.label}
                  </span>
                  {user.isVerified && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                      <CheckCircle className="w-4 h-4" />
                      Đã xác minh
                    </span>
                  )}
                </div>
              </div>

              {/* Edit Button */}
              <div className="flex gap-2">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    <Edit2 className="w-4 h-4" />
                    Chỉnh sửa
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                      {isSaving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Lưu
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      Hủy
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* User Details */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{user.email}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Nhập số điện thoại"
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600"
                    />
                  ) : (
                    <>
                      <p className="text-sm text-gray-500">Số điện thoại</p>
                      <p className="font-medium text-gray-800">
                        {user.phone || "Chưa cập nhật"}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Created At */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày tham gia</p>
                  <p className="font-medium text-gray-800">
                    {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vai trò</p>
                  <p className="font-medium text-gray-800">
                    {roleBadge.icon} {roleBadge.label}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            {user.role === "LANDLORD" && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Thông tin chủ trọ
                </h3>
                <p className="text-gray-700">
                  Bạn có thể đăng phòng và quản lý hợp đồng thuê
                </p>
                <button
                  onClick={() => navigate("/landlord/add-room")}
                  className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Đăng phòng mới
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/contracts")}
            className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition text-left"
          >
            <div className="text-3xl mb-2">📄</div>
            <h3 className="font-bold text-gray-800">Hợp đồng</h3>
            <p className="text-sm text-gray-600">Xem hợp đồng thuê phòng</p>
          </button>

          <button
            onClick={() => navigate("/payments")}
            className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition text-left"
          >
            <div className="text-3xl mb-2">💰</div>
            <h3 className="font-bold text-gray-800">Thanh toán</h3>
            <p className="text-sm text-gray-600">Lịch sử giao dịch</p>
          </button>

          <button
            onClick={() => navigate("/support")}
            className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition text-left"
          >
            <div className="text-3xl mb-2">🛠️</div>
            <h3 className="font-bold text-gray-800">Hỗ trợ</h3>
            <p className="text-sm text-gray-600">Yêu cầu hỗ trợ</p>
          </button>
        </div>
      </div>
    </div>
  );
}
