import React, { useState } from "react";
import {
  X,
  MapPin,
  Home,
  Calendar,
  Phone,
  Mail,
  Loader2,
  CheckCircle,
} from "lucide-react";
import axios from "axios";

export default function ModalRoomDetail({ room, isOpen, onClose }) {
  if (!isOpen || !room) return null;

  const [currentImage, setCurrentImage] = useState(0);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [qrUrl, setQrUrl] = useState(null);
  const [isPaid, setIsPaid] = useState(false);

  // 🧩 Dữ liệu phòng (fallback nếu thiếu)
  const roomData = {
    id: room.id || 1,
    title: room.title || "Phòng trọ cao cấp gần Đại học Bách Khoa",
    area: room.area || 25,
    price: room.price || 3000000,
    status: room.status || "available",
    description:
      room.description ||
      "Phòng mới xây, đầy đủ nội thất, gần trường học và siêu thị.",
    address: room.address || "123 Đường Láng, Quận Đống Đa, Hà Nội",
    imageUrls:
      room.imageUrls?.length > 0
        ? room.imageUrls
        : [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
            "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800",
          ],
    landlord: room.landlord || {
      id: 1,
      name: "Nguyễn Văn A",
      phone: "0123456789",
      email: "landlord@example.com",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    createdAt: room.createdAt || "2024-10-10T10:00:00",
  };

  // ⚙️ Hàm xử lý thanh toán
  const handlePayment = async () => {
    setLoadingPayment(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) {
        alert("⚠️ Vui lòng đăng nhập trước khi thanh toán!");
        return;
      }

      // 🧾 Dữ liệu gửi sang payment-service
      const body = {
        roomId: roomData.id,
        roomPrice: roomData.price,
      };

      console.log("📤 Gửi yêu cầu thanh toán:", body);

      const res = await axios.post(
        "http://localhost:4000/payments/create", // ✅ Gọi trực tiếp Payment-service
        body
      );

      const payment = res.data?.payment;

      if (payment?.checkoutUrl) {
        // ✅ Cách 1: mở trang thanh toán PayOS trực tiếp
        window.open(payment.checkoutUrl, "_blank");
      } else if (payment?.qrCode) {
        // ✅ Cách 2: hiển thị QR nếu API trả về mã
        setQrUrl(payment.qrCode);
      } else {
        alert("Không tạo được link thanh toán!");
      }
    } catch (error) {
      console.error("❌ Lỗi thanh toán:", error);
      alert(
        error.response?.data?.message ||
          "Lỗi khi tạo giao dịch thanh toán! Vui lòng thử lại."
      );
    } finally {
      setLoadingPayment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-gray-800">Chi tiết phòng</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Nội dung */}
        <div className="overflow-y-auto flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Ảnh phòng */}
            <div className="lg:col-span-2 space-y-6">
              <div className="relative">
                <img
                  src={roomData.imageUrls[currentImage]}
                  alt={`Room ${currentImage + 1}`}
                  className="w-full h-96 object-cover rounded-xl"
                />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/50 px-3 py-2 rounded-full">
                  {roomData.imageUrls.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`w-2 h-2 rounded-full transition ${
                        currentImage === i
                          ? "bg-white w-6"
                          : "bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-800">
                {roomData.title}
              </h1>

              <div className="flex items-center gap-4 text-gray-600">
                <Home className="w-4 h-4" />
                {roomData.area}m²
                <MapPin className="w-4 h-4" />
                {roomData.address}
                <Calendar className="w-4 h-4" />
                {new Date(roomData.createdAt).toLocaleDateString("vi-VN")}
              </div>

              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                <h3 className="text-indigo-100 text-sm mb-1">
                  Giá thuê / tháng
                </h3>
                <p className="text-3xl font-bold">
                  {roomData.price.toLocaleString()} đ
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  📝 Mô tả
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {roomData.description}
                </p>
              </div>
            </div>

            {/* Chủ trọ + Thanh toán */}
            <div className="space-y-6">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 sticky top-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  👤 Chủ trọ
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={roomData.landlord.avatar}
                    alt={roomData.landlord.name}
                    className="w-16 h-16 rounded-full border-2 border-indigo-200"
                  />
                  <div>
                    <p className="font-bold text-gray-800">
                      {roomData.landlord.name}
                    </p>
                    <p className="text-sm text-gray-500">Chủ nhà</p>
                  </div>
                </div>
                <div className="space-y-3 mb-4">
                  <a
                    href={`tel:${roomData.landlord.phone}`}
                    className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{roomData.landlord.phone}</span>
                  </a>
                  <a
                    href={`mailto:${roomData.landlord.email}`}
                    className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{roomData.landlord.email}</span>
                  </a>
                </div>

                {/* Nút thanh toán */}
                <div className="space-y-3">
                  {!qrUrl ? (
                    <button
                      onClick={handlePayment}
                      disabled={loadingPayment}
                      className={`w-full px-4 py-3 rounded-lg font-medium text-white transition ${
                        loadingPayment
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {loadingPayment ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Đang tạo mã QR...
                        </span>
                      ) : (
                        "💳 Đặt thuê / Thanh toán"
                      )}
                    </button>
                  ) : (
                    <div className="text-center">
                      <h3 className="text-gray-800 font-semibold mb-2">
                        Quét mã VietQR để thanh toán
                      </h3>
                      <img
                        src={qrUrl}
                        alt="QR Thanh toán"
                        className="mx-auto w-60 h-60 rounded-lg border p-2 shadow-md"
                      />
                      <button
                        onClick={() => setIsPaid(true)}
                        className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                      >
                        ✅ Đã thanh toán xong
                      </button>
                    </div>
                  )}
                  {isPaid && (
                    <div className="flex items-center justify-center gap-2 mt-3 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span>Đã ghi nhận thanh toán!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
