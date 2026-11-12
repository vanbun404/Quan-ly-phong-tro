// src/components/RoomCard.jsx
import React from "react";
import { FiMapPin, FiStar, FiHeart } from "react-icons/fi";

const fallbackImg =
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop";

// 🧠 Hàm tự động resize ảnh Cloudinary (nếu có)
const optimizeImage = (url, width = 800, height = 600) => {
  if (!url) return fallbackImg;
  if (!url.includes("res.cloudinary.com")) return url; // không phải cloudinary thì giữ nguyên
  return url.replace(
    "/upload/",
    `/upload/c_fill,w_${width},h_${height},q_auto,f_auto/`
  );
};

export default function RoomCard({
  title,
  price,
  unit,
  address,
  imageUrl,
  area,
  beds,
  baths,
  rating,
  isFavorite,
  onClick,
  onToggleFavorite,
}) {
  const priceFmt = price ? new Intl.NumberFormat("vi-VN").format(price) : 0;

  return (
    <div
      role="button"
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 hover:shadow-xl transition-all cursor-pointer"
    >
      {/* 🖼 Ảnh phòng */}
      <div className="relative w-full h-56 overflow-hidden bg-gray-100">
        <img
          src={optimizeImage(imageUrl)}
          alt={title}
          loading="lazy"
          onError={(e) => (e.currentTarget.src = fallbackImg)}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* ❤️ Nút yêu thích */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(!isFavorite);
          }}
          aria-label="Yêu thích"
          className="absolute right-3 top-3 inline-flex items-center justify-center rounded-full bg-white/90 p-2 shadow hover:bg-white cursor-pointer transition"
        >
          <FiHeart
            className={`h-5 w-5 ${
              isFavorite ? "fill-red-500 stroke-red-500" : "stroke-gray-700"
            }`}
          />
        </button>

        {/* ⭐️ Rating */}
        {rating && (
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs text-white">
            <FiStar className="h-4 w-4" />
            <span>{rating}</span>
          </div>
        )}
      </div>

      {/* 📄 Thông tin */}
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-base font-semibold text-gray-900">
            {title}
          </h3>
          <div className="text-right">
            <div className="text-lg font-extrabold text-indigo-600">
              {priceFmt}
            </div>
            <div className="text-xs text-gray-500">{unit}</div>
          </div>
        </div>

        <div className="mb-2 flex items-center gap-1 text-sm text-gray-600">
          <FiMapPin className="mt-[2px] h-4 w-4" />
          <span className="line-clamp-1">{address}</span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-700">
          <span className="rounded-full bg-gray-100 px-3 py-1">{area} m²</span>
          <span className="rounded-full bg-gray-100 px-3 py-1">{beds} PN</span>
          <span className="rounded-full bg-gray-100 px-3 py-1">{baths} WC</span>
        </div>
      </div>

      {/* Hiệu ứng border khi hover */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-transparent transition-colors group-hover:bg-indigo-500" />
    </div>
  );
}
