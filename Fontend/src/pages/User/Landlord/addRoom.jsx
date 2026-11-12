import React, { useState } from "react";
import axios from "axios";

export default function AddRoom() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    area: "",
    address: "",
    images: [], // lưu tạm ảnh preview
  });

  // 🧠 Xử lý thay đổi dữ liệu
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // 📷 Upload ảnh (chưa upload cloudinary, chỉ preview tạm)
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setFormData({ ...formData, images: [...formData.images, ...urls] });
  };

  // ❌ Xoá ảnh
  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  // 🚀 Gửi dữ liệu về backend
  const handleSubmit = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        alert("Vui lòng đăng nhập trước khi thêm phòng.");
        return;
      }
      if (user.role !== "LANDLORD") {
        alert("Chỉ chủ nhà mới có quyền thêm phòng.");
        return;
      }
      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("price", formData.price);
      form.append("area", formData.area);
      form.append("address", formData.address);
      form.append("ownerId", user.id);
      // Gửi ảnh (nếu có)
      const fileInput = document.getElementById("image-upload");
      const files = fileInput.files;
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          form.append("images", files[i]);
        }
      } else {
        alert("Vui lòng tải lên ít nhất một hình ảnh của phòng.");
        return;
      }
      // Gọi API
      const res = await axios.post("http://localhost:8000/rooms", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Thêm phòng thành công!");
      console.log("✅ Phòng mới:", res.data);
      // Reset form
      setFormData({
        title: "",
        description: "",
        price: "",
        area: "",
        address: "",
        images: [],
      });
      document.getElementById("image-upload").value = null;
    } catch (error) {
      console.error("❌ Lỗi thêm phòng:", error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 mt-20">
      <div className="container mx-auto max-w-3xl bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          🏠 Thêm phòng mới
        </h1>

        {/* Tiêu đề */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">-- Chọn loại phòng --</option>
            <option value="Chung cư">Chung cư</option>
            <option value="Nhà nguyên căn">Nhà nguyên căn</option>
            <option value="Phòng trọ">Phòng trọ</option>
          </select>
        </div>

        {/* Mô tả */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mô tả
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={4}
            placeholder="Mô tả chi tiết về phòng, tiện ích, khu vực..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Giá và Diện tích */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giá thuê (VND/tháng)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => handleChange("price", e.target.value)}
              placeholder="VD: 3000000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Diện tích (m²)
            </label>
            <input
              type="number"
              value={formData.area}
              onChange={(e) => handleChange("area", e.target.value)}
              placeholder="VD: 25"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Địa chỉ */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Địa chỉ
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="VD: 123 Đường Láng, Cầu Giấy, Hà Nội"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Ảnh */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Hình ảnh phòng
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer inline-flex flex-col items-center"
            >
              <span className="text-4xl mb-2">📷</span>
              <span className="text-gray-600 font-medium">
                Nhấp để tải ảnh lên
              </span>
              <span className="text-gray-400 text-sm mt-1">
                PNG, JPG (tối đa 5MB)
              </span>
            </label>
          </div>

          {/* Preview ảnh */}
          {formData.images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 md:grid-cols-5 gap-4">
              {formData.images.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img}
                    alt={`Preview ${index}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Nút Submit */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            ✓ Đăng phòng
          </button>
        </div>
      </div>
    </div>
  );
}
