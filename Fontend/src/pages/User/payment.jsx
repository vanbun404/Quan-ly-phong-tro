import React, { useState } from "react";

export default function Payment() {
  const [activeTab, setActiveTab] = useState("history"); // "history", "pending", "methods"
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Mock data - Lịch sử thanh toán
  const payments = [
    {
      id: 1,
      type: "rent",
      amount: 3000000,
      status: "completed",
      method: "bank_transfer",
      description: "Tiền thuê tháng 10/2024 - Phòng 101",
      createdAt: "2024-10-01T08:00:00",
      completedAt: "2024-10-01T08:30:00",
      transactionId: "TXN001234567",
    },
    {
      id: 2,
      type: "deposit",
      amount: 6000000,
      status: "completed",
      method: "vnpay",
      description: "Tiền cọc phòng 101",
      createdAt: "2024-09-15T10:00:00",
      completedAt: "2024-09-15T10:05:00",
      transactionId: "TXN001234566",
    },
    {
      id: 3,
      type: "utility",
      amount: 450000,
      status: "completed",
      method: "bank_transfer",
      description: "Tiền điện nước tháng 9/2024",
      createdAt: "2024-09-28T14:20:00",
      completedAt: "2024-09-28T15:00:00",
      transactionId: "TXN001234565",
    },
  ];

  // Mock data - Hóa đơn chờ thanh toán
  const pendingBills = [
    {
      id: 4,
      type: "rent",
      amount: 3000000,
      status: "pending",
      description: "Tiền thuê tháng 11/2024 - Phòng 101",
      dueDate: "2024-11-05T23:59:59",
      roomName: "Phòng 101 - Tòa A",
    },
    {
      id: 5,
      type: "utility",
      amount: 520000,
      status: "pending",
      description: "Tiền điện nước tháng 10/2024",
      dueDate: "2024-11-03T23:59:59",
      roomName: "Phòng 101 - Tòa A",
      details: {
        electric: 350000,
        water: 120000,
        internet: 50000,
      },
    },
  ];

  // Payment methods
  const paymentMethods = [
    {
      id: "bank_transfer",
      name: "Chuyển khoản ngân hàng",
      icon: "🏦",
      description: "Techcombank - 1234567890 - Nguyen Van A",
      isDefault: true,
    },
    {
      id: "vnpay",
      name: "VNPay",
      icon: "💳",
      description: "Thanh toán qua ví điện tử VNPay",
      isDefault: false,
    },
    {
      id: "momo",
      name: "Momo",
      icon: "📱",
      description: "Thanh toán qua ví Momo",
      isDefault: false,
    },
  ];

  const statusConfig = {
    completed: { color: "bg-green-100 text-green-700", label: "Đã thanh toán" },
    pending: {
      color: "bg-yellow-100 text-yellow-700",
      label: "Chờ thanh toán",
    },
    failed: { color: "bg-red-100 text-red-700", label: "Thất bại" },
    refunded: { color: "bg-gray-100 text-gray-700", label: "Đã hoàn tiền" },
  };

  const typeLabels = {
    rent: "Tiền thuê",
    deposit: "Tiền cọc",
    utility: "Điện nước",
    service: "Dịch vụ",
  };

  const methodLabels = {
    bank_transfer: "Chuyển khoản",
    vnpay: "VNPay",
    momo: "Momo",
    cash: "Tiền mặt",
  };

  // Calculate overdue
  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  // Handle payment
  const handlePayNow = (bill) => {
    setSelectedPayment(bill);
    setShowPaymentModal(true);
  };

  const processPayment = (method) => {
    console.log("Thanh toán:", selectedPayment, "bằng:", method);
    alert(
      `Đang xử lý thanh toán ${selectedPayment.amount.toLocaleString()}đ qua ${
        methodLabels[method]
      }`
    );
    setShowPaymentModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 mt-20">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            💰 Quản lý thanh toán
          </h1>
          <p className="text-gray-600">
            Theo dõi lịch sử và thanh toán hóa đơn
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <p className="text-blue-100 text-sm mb-1">Tổng đã thanh toán</p>
            <p className="text-3xl font-bold">
              {payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}đ
            </p>
            <p className="text-blue-100 text-xs mt-2">
              {payments.length} giao dịch
            </p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
            <p className="text-yellow-100 text-sm mb-1">Chờ thanh toán</p>
            <p className="text-3xl font-bold">
              {pendingBills
                .reduce((sum, p) => sum + p.amount, 0)
                .toLocaleString()}
              đ
            </p>
            <p className="text-yellow-100 text-xs mt-2">
              {pendingBills.length} hóa đơn
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <p className="text-purple-100 text-sm mb-1">
              Chi phí trung bình/tháng
            </p>
            <p className="text-3xl font-bold">
              {(
                payments.reduce((sum, p) => sum + p.amount, 0) / 3
              ).toLocaleString()}
              đ
            </p>
            <p className="text-purple-100 text-xs mt-2">3 tháng gần nhất</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-3 font-medium transition ${
              activeTab === "pending"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            ⏳ Chờ thanh toán ({pendingBills.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-3 font-medium transition ${
              activeTab === "history"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            📜 Lịch sử ({payments.length})
          </button>
          <button
            onClick={() => setActiveTab("methods")}
            className={`px-6 py-3 font-medium transition ${
              activeTab === "methods"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            💳 Phương thức thanh toán
          </button>
        </div>

        {/* TAB 1: Chờ thanh toán */}
        {activeTab === "pending" && (
          <div className="space-y-4">
            {pendingBills.length > 0 ? (
              pendingBills.map((bill) => (
                <div
                  key={bill.id}
                  className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-l-4 ${
                    isOverdue(bill.dueDate)
                      ? "border-red-500"
                      : "border-yellow-500"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">
                          {bill.description}
                        </h3>
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium ${
                            isOverdue(bill.dueDate)
                              ? "bg-red-100 text-red-700"
                              : statusConfig[bill.status].color
                          }`}
                        >
                          {isOverdue(bill.dueDate)
                            ? "⚠️ Quá hạn"
                            : statusConfig[bill.status].label}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-1">
                        🏠 {bill.roomName}
                      </p>
                      <p className="text-gray-600 text-sm">
                        📅 Hạn thanh toán:{" "}
                        <span
                          className={
                            isOverdue(bill.dueDate)
                              ? "text-red-600 font-semibold"
                              : "font-medium"
                          }
                        >
                          {new Date(bill.dueDate).toLocaleString("vi-VN")}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-indigo-600">
                        {bill.amount.toLocaleString()}đ
                      </p>
                      <p className="text-gray-500 text-sm">
                        {typeLabels[bill.type]}
                      </p>
                    </div>
                  </div>

                  {/* Chi tiết điện nước */}
                  {bill.details && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-gray-700 mb-2 text-sm">
                        Chi tiết:
                      </p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Điện</p>
                          <p className="font-semibold">
                            {bill.details.electric.toLocaleString()}đ
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Nước</p>
                          <p className="font-semibold">
                            {bill.details.water.toLocaleString()}đ
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Internet</p>
                          <p className="font-semibold">
                            {bill.details.internet.toLocaleString()}đ
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePayNow(bill)}
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                    >
                      💳 Thanh toán ngay
                    </button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium">
                      📄 Chi tiết
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-6xl mb-4">✅</div>
                <p className="text-gray-500 text-lg">
                  Không có hóa đơn nào chờ thanh toán
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Lịch sử */}
        {activeTab === "history" && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Mã GD
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Mô tả
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Loại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Số tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Phương thức
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ngày
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">
                      {payment.transactionId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {payment.description}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {typeLabels[payment.type]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-indigo-600">
                      {payment.amount.toLocaleString()}đ
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {methodLabels[payment.method]}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(payment.completedAt).toLocaleDateString(
                        "vi-VN"
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          statusConfig[payment.status].color
                        }`}
                      >
                        {statusConfig[payment.status].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: Phương thức thanh toán */}
        {activeTab === "methods" && (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition ${
                  method.isDefault ? "border-2 border-indigo-500" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{method.icon}</div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-800">
                          {method.name}
                        </h3>
                        {method.isDefault && (
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
                            Mặc định
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">
                        {method.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!method.isDefault && (
                      <button className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition text-sm font-medium">
                        Đặt mặc định
                      </button>
                    )}
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-medium">
                      Chỉnh sửa
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button className="w-full px-6 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-indigo-500 hover:text-indigo-600 transition font-medium">
              ➕ Thêm phương thức thanh toán
            </button>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              💳 Chọn phương thức thanh toán
            </h2>
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-sm mb-1">Số tiền thanh toán:</p>
              <p className="text-2xl font-bold text-indigo-600">
                {selectedPayment?.amount.toLocaleString()}đ
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {selectedPayment?.description}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => processPayment(method.id)}
                  className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition"
                >
                  <span className="text-3xl">{method.icon}</span>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-gray-800">{method.name}</p>
                    <p className="text-gray-600 text-sm">
                      {method.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowPaymentModal(false)}
              className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
