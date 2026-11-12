import React, { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function RoomManagement() {
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [buildings] = useState([
    { id: 1, name: "Tòa A" },
    { id: 2, name: "Tòa B" },
  ]);

  const rooms = {
    1: [
      {
        id: 101,
        name: "Phòng 101",
        type: "Đơn",
        status: "Đang thuê",
        price: 2500000,
      },
      {
        id: 102,
        name: "Phòng 102",
        type: "Đôi",
        status: "Trống",
        price: 3500000,
      },
    ],
    2: [
      {
        id: 201,
        name: "Phòng 201",
        type: "Đơn",
        status: "Đang thuê",
        price: 2800000,
      },
      {
        id: 202,
        name: "Phòng 202",
        type: "Đôi",
        status: "Trống",
        price: 3700000,
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">🏠 Quản lý phòng</h1>

      <div className="mb-4 flex gap-3 items-center">
        <label className="font-medium">Chọn tòa:</label>
        <select
          className="border rounded-lg px-3 py-2"
          value={selectedBuilding}
          onChange={(e) => setSelectedBuilding(e.target.value)}
        >
          <option value="">-- Chọn tòa nhà --</option>
          {buildings.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {selectedBuilding && (
        <>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">
              Danh sách phòng của{" "}
              {buildings.find((b) => b.id == selectedBuilding)?.name}
            </h2>
            <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              <Plus size={18} /> Thêm phòng
            </button>
          </div>

          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="min-w-full text-left border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 border-b">Mã phòng</th>
                  <th className="px-4 py-3 border-b">Tên phòng</th>
                  <th className="px-4 py-3 border-b">Loại</th>
                  <th className="px-4 py-3 border-b">Trạng thái</th>
                  <th className="px-4 py-3 border-b">Giá thuê (VNĐ)</th>
                  <th className="px-4 py-3 border-b text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {rooms[selectedBuilding]?.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{r.id}</td>
                    <td className="px-4 py-2 border-b font-medium">{r.name}</td>
                    <td className="px-4 py-2 border-b">{r.type}</td>
                    <td
                      className={`px-4 py-2 border-b font-medium ${
                        r.status === "Đang thuê"
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {r.status}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {r.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 border-b text-center">
                      <button className="text-blue-600 hover:text-blue-800 mr-2">
                        <Pencil size={18} />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
