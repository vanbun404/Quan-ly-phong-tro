import React, { useEffect, useState } from "react";
import axios from "axios";
import RoomCard from "../../Component/RoomCard";
import ModalRoomDetail from "./modal/modalRoomDetail";

export default function SearchPage() {
  const [roomsData, setRoomsData] = useState([]);
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Gọi API khi component load lần đầu
  useEffect(() => {
    fetchRooms();
  }, []);

  // ✅ Hàm gọi API trực tiếp tới backend
  const fetchRooms = async () => {
    try {
      // ⚠️ Đổi URL nếu bạn đang chạy bằng Docker (ví dụ http://room-service:8000)
      const baseUrl = "http://localhost:8000/rooms";

      // Tạo query string (lọc theo các ô nhập)
      const params = {};
      if (location) params.location = location;
      if (type) params.type = type;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await axios.get(baseUrl, { params });

      setRoomsData(res.data);
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách phòng:", error);
      alert("Không thể tải danh sách phòng từ server!");
    }
  };

  // ✅ Gọi lại khi người dùng thay đổi bộ lọc
  useEffect(() => {
    fetchRooms();
  }, [location, type, minPrice, maxPrice]);

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
  };

  return (
    <div className="min-h-screen bg-gray-200 px-6 py-10 mt-10">
      <div className="container mx-auto">
        {/* Bộ lọc */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="rounded-lg border px-4 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">Chọn địa điểm</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="TP.HCM">TP.HCM</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
          </select>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-lg border px-4 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">Chọn loại phòng</option>
            <option value="phòng trọ">Phòng trọ</option>
            <option value="nhà nguyên căn">Nhà nguyên căn</option>
            <option value="chung cư">Chung cư mini</option>
          </select>

          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Giá tối thiểu"
            className="rounded-lg border px-4 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400"
          />

          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Giá tối đa"
            className="rounded-lg border px-4 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Danh sách kết quả */}
        {roomsData.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {roomsData.map((room) => (
              <RoomCard
                key={room.id}
                title={room.title}
                price={room.price}
                address={room.address}
                imageUrl={
                  room.imageUrls?.[0] || "https://via.placeholder.com/400"
                }
                area={room.area}
                onClick={() => handleRoomClick(room)}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Không tìm thấy phòng nào phù hợp.</p>
        )}
      </div>

      {/* Modal chi tiết */}
      <ModalRoomDetail
        room={selectedRoom}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
