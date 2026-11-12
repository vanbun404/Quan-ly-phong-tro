import React, { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function ContractManagement() {
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");

  const buildings = [
    { id: 1, name: "Tòa A" },
    { id: 2, name: "Tòa B" },
  ];

  const rooms = {
    1: [
      { id: 101, name: "Phòng 101" },
      { id: 102, name: "Phòng 102" },
    ],
    2: [
      { id: 201, name: "Phòng 201" },
      { id: 202, name: "Phòng 202" },
    ],
  };

  const contracts = {
    101: [
      {
        id: "HD001",
        tenant: "Nguyễn Văn A",
        start: "2024-01-01",
        end: "2024-12-31",
        price: 2500000,
        status: "Đang hiệu lực",
      },
    ],
    102: [
      {
        id: "HD002",
        tenant: "Trần Thị B",
        start: "2024-05-01",
        end: "2025-04-30",
        price: 3000000,
        status: "Sắp hết hạn",
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">📄 Quản lý hợp đồng</h1>

      {/* Bộ lọc */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block font-medium mb-1">Tòa nhà</label>
          <select
            className="border rounded-lg px-3 py-2 w-48"
            value={selectedBuilding}
            onChange={(e) => {
              setSelectedBuilding(e.target.value);
              setSelectedRoom("");
            }}
          >
            <option value="">-- Chọn tòa --</option>
            {buildings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {selectedBuilding && (
          <div>
            <label className="block font-medium mb-1">Phòng</label>
            <select
              className="border rounded-lg px-3 py-2 w-48"
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
            >
              <option value="">-- Chọn phòng --</option>
              {rooms[selectedBuilding].map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Danh sách hợp đồng */}
      {selectedRoom && (
        <>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">
              Hợp đồng của{" "}
              {rooms[selectedBuilding].find((r) => r.id == selectedRoom)?.name}
            </h2>
            <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              <Plus size={18} /> Tạo hợp đồng mới
            </button>
          </div>

          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="min-w-full text-left border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 border-b">Mã HĐ</th>
                  <th className="px-4 py-3 border-b">Người thuê</th>
                  <th className="px-4 py-3 border-b">Ngày bắt đầu</th>
                  <th className="px-4 py-3 border-b">Ngày kết thúc</th>
                  <th className="px-4 py-3 border-b">Giá thuê</th>
                  <th className="px-4 py-3 border-b">Trạng thái</th>
                  <th className="px-4 py-3 border-b text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {contracts[selectedRoom]?.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{c.id}</td>
                    <td className="px-4 py-2 border-b font-medium">
                      {c.tenant}
                    </td>
                    <td className="px-4 py-2 border-b">{c.start}</td>
                    <td className="px-4 py-2 border-b">{c.end}</td>
                    <td className="px-4 py-2 border-b">
                      {c.price.toLocaleString()} ₫
                    </td>
                    <td
                      className={`px-4 py-2 border-b font-medium ${
                        c.status === "Đang hiệu lực"
                          ? "text-green-600"
                          : c.status === "Sắp hết hạn"
                          ? "text-orange-500"
                          : "text-gray-500"
                      }`}
                    >
                      {c.status}
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
