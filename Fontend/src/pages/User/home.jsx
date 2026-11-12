import React, { useState, useEffect } from "react";
import anhquangcao from "../../assets/imgs/logo1.jpg";
import RoomCard from "../../Component/RoomCard";
import ModalRoomDetail from "./modal/modalRoomDetail";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { getLatestRooms } from "../../api/roomApi";
import "swiper/css";
import "swiper/css/navigation";

const Home = () => {
  const [newRooms, setNewRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Gọi API thật khi trang được load
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("http://localhost:8000/rooms/latest");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        console.log("✅ Dữ liệu phòng nhận được từ backend:", data);

        setNewRooms(data || []);
      } catch (error) {
        console.error("❌ Lỗi khi tải phòng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
  };

  // 🌀 Loading UI
  if (loading) {
    return (
      <div className="text-center text-gray-300 mt-20">
        ⏳ Đang tải phòng...
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen px-6">
      {/* 🏠 Hero Section */}
      <div className="container mx-auto grid md:grid-cols-2 gap-10 items-center py-16">
        <div className="text-white space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Tìm phòng trọ đơn giản <br /> và thuận tiện
          </h1>
          <p className="text-gray-300">
            Hỗ trợ quảng cáo và tìm kiếm phòng trọ nhanh chóng, dễ dàng
          </p>

          <div className="bg-white rounded-md shadow-md flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x overflow-hidden">
            <select className="p-4 outline-none text-gray-700 flex-1">
              <option>Vị trí</option>
              <option>Hà Nội</option>
              <option>TP.HCM</option>
            </select>
            <select className="p-4 outline-none text-gray-700 flex-1">
              <option>Kiểu</option>
              <option>Chung cư</option>
              <option>Nhà nguyên căn</option>
              <option>Phòng trọ</option>
            </select>
            <button className="bg-teal-500 text-white px-6 py-4 font-medium hover:bg-teal-600 transition cursor-pointer">
              Tìm kiếm
            </button>
          </div>
        </div>

        <div>
          <img src={anhquangcao} alt="House" className="rounded-lg shadow-lg" />
        </div>
      </div>

      <div className="container mx-auto py-10">
        <h2 className="text-2xl font-bold text-gray-200 mb-6">
          Phòng mới được đăng
        </h2>

        {newRooms.length === 0 ? (
          <p className="text-gray-400">Chưa có phòng nào được đăng.</p>
        ) : (
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={20}
            slidesPerView={3}
            loop={true}
            breakpoints={{
              320: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {newRooms.map((room) => (
              <SwiperSlide key={room.id}>
                <RoomCard
                  title={room.title}
                  price={room.price}
                  address={room.address}
                  imageUrl={room.imageUrls?.[0]}
                  area={room.area}
                  rating={4.5}
                  onClick={() => handleRoomClick(room)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      <ModalRoomDetail
        room={selectedRoom}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Home;
