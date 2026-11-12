import React, { useState } from "react";

export default function MyContracts() {
  const [activeTab, setActiveTab] = useState("active"); // "active", "expired", "cancelled"

  // Mock data
  const contracts = [
    {
      id: 1,
      roomName: "Phòng 101 - Tòa A",
      landlord: "Nguyễn Văn A",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      monthlyRent: 3000000,
      deposit: 6000000,
      status: "active",
      address: "123 Đường ABC, Quận 1, TP.HCM",
    },
    {
      id: 2,
      roomName: "Phòng 205 - Chung cư X",
      landlord: "Trần Thị B",
      startDate: "2023-06-01",
      endDate: "2024-05-31",
      monthlyRent: 4500000,
      deposit: 9000000,
      status: "expired",
      address: "456 Đường XYZ, Quận 3, TP.HCM",
    },
    {
      id: 3,
      roomName: "Phòng Studio - Villa C",
      landlord: "Lê Văn C",
      startDate: "2024-03-01",
      endDate: "2024-09-01",
      monthlyRent: 5000000,
      deposit: 10000000,
      status: "cancelled",
      address: "789 Đường PQR, Quận 7, TP.HCM",
    },
  ];

  const filteredContracts = contracts.filter((c) => c.status === activeTab);

  const statusColors = {
    active: "bg-green-100 text-green-700",
    expired: "bg-gray-100 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const statusLabels = {
    active: "Đang hoạt động",
    expired: "Đã hết hạn",
    cancelled: "Đã hủy",
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 mt-20">
      {" "}
      {/* ✅ Thêm mt-20 hoặc pt-20 */}
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📋 Hợp đồng của tôi
          </h1>
          <p className="text-gray-600">Quản lý tất cả hợp đồng thuê phòng</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-6 py-3 font-medium transition ${
              activeTab === "active"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Đang hoạt động (
            {contracts.filter((c) => c.status === "active").length})
          </button>
          <button
            onClick={() => setActiveTab("expired")}
            className={`px-6 py-3 font-medium transition ${
              activeTab === "expired"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Đã hết hạn ({contracts.filter((c) => c.status === "expired").length}
            )
          </button>
          <button
            onClick={() => setActiveTab("cancelled")}
            className={`px-6 py-3 font-medium transition ${
              activeTab === "cancelled"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Đã hủy ({contracts.filter((c) => c.status === "cancelled").length})
          </button>
        </div>

        {/* Contracts List */}
        {filteredContracts.length > 0 ? (
          <div className="space-y-4">
            {filteredContracts.map((contract) => (
              <div
                key={contract.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">
                        {contract.roomName}
                      </h3>
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium ${
                          statusColors[contract.status]
                        }`}
                      >
                        {statusLabels[contract.status]}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-1">
                      🏠 {contract.address}
                    </p>
                    <p className="text-gray-600 text-sm">
                      👤 Chủ trọ:{" "}
                      <span className="font-medium">{contract.landlord}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Ngày bắt đầu</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(contract.startDate).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Ngày kết thúc</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(contract.endDate).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">
                      Tiền thuê/tháng
                    </p>
                    <p className="font-semibold text-indigo-600">
                      {contract.monthlyRent.toLocaleString()}đ
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Tiền cọc</p>
                    <p className="font-semibold text-gray-800">
                      {contract.deposit.toLocaleString()}đ
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium">
                    📄 Xem chi tiết
                  </button>
                  {contract.status === "active" && (
                    <>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium">
                        💰 Thanh toán
                      </button>
                      <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-sm font-medium">
                        🔄 Gia hạn
                      </button>
                    </>
                  )}
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-medium">
                    📥 Tải hợp đồng
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-lg mb-2">
              Không có hợp đồng nào trong mục này
            </p>
            <p className="text-gray-400 text-sm">
              {activeTab === "active" && "Bạn chưa có hợp đồng đang hoạt động"}
              {activeTab === "expired" && "Chưa có hợp đồng nào hết hạn"}
              {activeTab === "cancelled" && "Chưa có hợp đồng nào bị hủy"}
            </p>
          </div>
        )}

        {/* Summary Card */}
        {filteredContracts.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <h3 className="text-lg font-bold mb-4">📊 Thống kê</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-indigo-100 text-sm mb-1">Tổng hợp đồng</p>
                <p className="text-3xl font-bold">{contracts.length}</p>
              </div>
              <div>
                <p className="text-indigo-100 text-sm mb-1">Đang hoạt động</p>
                <p className="text-3xl font-bold">
                  {contracts.filter((c) => c.status === "active").length}
                </p>
              </div>
              <div>
                <p className="text-indigo-100 text-sm mb-1">
                  Tổng chi phí/tháng
                </p>
                <p className="text-3xl font-bold">
                  {contracts
                    .filter((c) => c.status === "active")
                    .reduce((sum, c) => sum + c.monthlyRent, 0)
                    .toLocaleString()}
                  đ
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
