import React, { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function BuildingManagement() {
  const [buildings, setBuildings] = useState([
    { id: 1, name: "Tòa A", address: "123 Nguyễn Văn Cừ, Q.5", totalRooms: 12 },
    { id: 2, name: "Tòa B", address: "45 Trần Hưng Đạo, Q.1", totalRooms: 20 },
  ]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">🏢 Quản lý tòa nhà</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus size={18} /> Thêm tòa nhà
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 border-b">Mã tòa</th>
              <th className="px-4 py-3 border-b">Tên tòa</th>
              <th className="px-4 py-3 border-b">Địa chỉ</th>
              <th className="px-4 py-3 border-b">Số phòng</th>
              <th className="px-4 py-3 border-b text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {buildings.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{b.id}</td>
                <td className="px-4 py-2 border-b font-medium">{b.name}</td>
                <td className="px-4 py-2 border-b">{b.address}</td>
                <td className="px-4 py-2 border-b">{b.totalRooms}</td>
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
    </div>
  );
}
