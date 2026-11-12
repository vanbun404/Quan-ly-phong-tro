import React, { useState, useEffect, useRef } from "react";
import {
  getSupportTickets,
  createSupportTicket,
  deleteTicket,
} from "../../api/supportReportApi";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Trash2,
  RefreshCw,
} from "lucide-react";

export default function SupportReport() {
  const [activeTab, setActiveTab] = useState("tickets");
  const [filterStatus, setFilterStatus] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const hasFetchedRef = useRef(false);
  const cacheRef = useRef({
    data: null,
    timestamp: null,
    ttl: 5000, // 5 seconds cache
  });

  // Form state
  const [form, setForm] = useState({
    title: "",
    category: "general",
    priority: "normal",
    description: "",
  });

  // ✅ Get current user
  const getCurrentUser = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        console.warn("⚠️ No user found in localStorage");
        return { id: null, role: "USER" };
      }
      return JSON.parse(userStr);
    } catch (err) {
      console.error("❌ Error parsing user:", err);
      return { id: null, role: "USER" };
    }
  };

  const currentUser = getCurrentUser();

  // ✅ Fetch tickets on mount
  useEffect(() => {
    if (hasFetchedRef.current) return;

    const initFetch = async () => {
      try {
        if (!currentUser.id) {
          console.warn("⚠️ No user ID, skipping fetch");
          setLoading(false);
          setError("Vui lòng đăng nhập để xem yêu cầu hỗ trợ");
          return;
        }

        hasFetchedRef.current = true;
        await fetchTickets();
      } catch (err) {
        console.error("❌ Init fetch error:", err);
        setError("Có lỗi xảy ra khi khởi tạo");
        setLoading(false);
      }
    };

    initFetch();

    return () => {
      hasFetchedRef.current = false;
    };
  }, []);

  // ✅ Fetch tickets from API
  const fetchTickets = async (forceRefresh = false) => {
    try {
      // Check cache
      if (
        !forceRefresh &&
        cacheRef.current.data &&
        cacheRef.current.timestamp
      ) {
        const age = Date.now() - cacheRef.current.timestamp;
        if (age < cacheRef.current.ttl) {
          console.log("📦 Using cached data");
          setTickets(cacheRef.current.data);
          setLoading(false);
          return;
        }
      }

      setLoading(true);
      setError(null);

      if (!currentUser.id) {
        throw new Error("User ID not found");
      }

      console.log("🔍 Fetching tickets for user:", currentUser.id);

      const response = await getSupportTickets(String(currentUser.id));

      console.log("📥 API Response:", response);

      if (response.success) {
        const ticketsData = response.data?.tickets || [];
        setTickets(ticketsData);

        // Update cache
        cacheRef.current = {
          data: ticketsData,
          timestamp: Date.now(),
          ttl: 5000,
        };
      } else {
        setError(response.message || "Không thể tải danh sách yêu cầu");
      }
    } catch (err) {
      console.error("❌ Fetch tickets error:", err);
      setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle refresh
  const handleRefresh = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    await fetchTickets(true);

    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  // ✅ Filter tickets
  const filteredTickets = filterStatus
    ? tickets.filter(
        (t) => t.status?.toLowerCase() === filterStatus.toLowerCase()
      )
    : tickets;

  // Status config
  const statusConfig = {
    open: {
      color: "bg-yellow-100 text-yellow-700",
      label: "Chờ xử lý",
      icon: Clock,
    },
    OPEN: {
      color: "bg-yellow-100 text-yellow-700",
      label: "Chờ xử lý",
      icon: Clock,
    },
    in_progress: {
      color: "bg-blue-100 text-blue-700",
      label: "Đang xử lý",
      icon: RefreshCw,
    },
    IN_PROGRESS: {
      color: "bg-blue-100 text-blue-700",
      label: "Đang xử lý",
      icon: RefreshCw,
    },
    resolved: {
      color: "bg-green-100 text-green-700",
      label: "Đã giải quyết",
      icon: CheckCircle,
    },
    RESOLVED: {
      color: "bg-green-100 text-green-700",
      label: "Đã giải quyết",
      icon: CheckCircle,
    },
    closed: {
      color: "bg-gray-100 text-gray-700",
      label: "Đã đóng",
      icon: CheckCircle,
    },
    CLOSED: {
      color: "bg-gray-100 text-gray-700",
      label: "Đã đóng",
      icon: CheckCircle,
    },
  };

  const priorityConfig = {
    LOW: { color: "bg-gray-100 text-gray-700", label: "Thấp" },
    low: { color: "bg-gray-100 text-gray-700", label: "Thấp" },
    NORMAL: { color: "bg-blue-100 text-blue-700", label: "Bình thường" },
    normal: { color: "bg-blue-100 text-blue-700", label: "Bình thường" },
    HIGH: { color: "bg-red-100 text-red-700", label: "Cao" },
    high: { color: "bg-red-100 text-red-700", label: "Cao" },
    URGENT: { color: "bg-red-200 text-red-800", label: "Khẩn cấp" },
    urgent: { color: "bg-red-200 text-red-800", label: "Khẩn cấp" },
  };

  const categoryLabels = {
    GENERAL: "Tổng quát",
    general: "Tổng quát",
    MAINTENANCE: "Bảo trì",
    maintenance: "Bảo trì",
    PAYMENT: "Thanh toán",
    payment: "Thanh toán",
    CONTRACT: "Hợp đồng",
    contract: "Hợp đồng",
    COMPLAINT: "Khiếu nại",
    complaint: "Khiếu nại",
    OTHER: "Khác",
    other: "Khác",
  };

  // ✅ Handle form submit - Call API
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser.id) {
      setError("Vui lòng đăng nhập để tạo yêu cầu");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const ticketData = {
        userId: String(currentUser.id),
        userRole: currentUser.role || "USER",
        title: form.title,
        category: form.category.toUpperCase(),
        priority: form.priority.toUpperCase(),
        description: form.description,
      };

      console.log("📤 Sending ticket data:", ticketData);

      const response = await createSupportTicket(ticketData);

      console.log("📥 Response:", response);

      if (response.success) {
        setSuccessMessage("✅ Yêu cầu đã được gửi thành công!");
        setForm({
          title: "",
          category: "general",
          priority: "normal",
          description: "",
        });
        setActiveTab("tickets");

        // Refresh tickets
        hasFetchedRef.current = false;
        await fetchTickets(true);

        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(response.message || "Không thể tạo yêu cầu");
      }
    } catch (err) {
      console.error("❌ Create ticket error:", err);
      setError(err.message || "Có lỗi xảy ra khi tạo yêu cầu");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Handle delete ticket - Call API
  const handleDelete = async (ticketId) => {
    if (!window.confirm("Bạn có chắc muốn xóa yêu cầu này?")) return;

    try {
      const response = await deleteTicket(ticketId);

      if (response.success) {
        setSuccessMessage("✅ Đã xóa yêu cầu");

        // Refresh tickets
        hasFetchedRef.current = false;
        await fetchTickets(true);

        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(response.message || "Không thể xóa yêu cầu");
      }
    } catch (err) {
      console.error("❌ Delete ticket error:", err);
      setError(err.message || "Có lỗi xảy ra khi xóa yêu cầu");
    }
  };

  // ✅ Loading state
  if (loading && tickets.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // ✅ No user state
  if (!currentUser.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="text-center bg-white rounded-lg shadow-md p-8 max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Chưa đăng nhập
          </h2>
          <p className="text-gray-600 mb-4">
            Vui lòng đăng nhập để sử dụng tính năng hỗ trợ
          </p>
          <a
            href="/login"
            className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Đăng nhập
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 mt-20">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🎫 Hỗ trợ & Báo cáo
          </h1>
          <p className="text-gray-600">Gửi yêu cầu hỗ trợ hoặc báo cáo sự cố</p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-700 font-medium">{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab("tickets")}
            className={`px-6 py-3 font-medium transition ${
              activeTab === "tickets"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            📋 Danh sách yêu cầu ({tickets.length})
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`px-6 py-3 font-medium transition ${
              activeTab === "create"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            ➕ Tạo yêu cầu mới
          </button>
        </div>

        {/* TAB 1: Danh sách ticket */}
        {activeTab === "tickets" && (
          <div>
            {/* Filters */}
            <div className="flex gap-2 mb-6 flex-wrap">
              <button
                onClick={() => setFilterStatus(null)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === null
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setFilterStatus("OPEN")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === "OPEN"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Chờ xử lý
              </button>
              <button
                onClick={() => setFilterStatus("IN_PROGRESS")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === "IN_PROGRESS"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Đang xử lý
              </button>
              <button
                onClick={() => setFilterStatus("RESOLVED")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === "RESOLVED"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Đã giải quyết
              </button>

              {/* Refresh button */}
              <button
                onClick={handleRefresh}
                disabled={loading || isRefreshing}
                className="ml-auto px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw
                  className={`w-4 h-4 ${
                    loading || isRefreshing ? "animate-spin" : ""
                  }`}
                />
                {isRefreshing ? "Đang tải..." : "Làm mới"}
              </button>
            </div>

            {/* Tickets List */}
            {loading ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Đang tải...</p>
              </div>
            ) : filteredTickets.length > 0 ? (
              <div className="space-y-4">
                {filteredTickets.map((ticket) => {
                  const StatusIcon =
                    statusConfig[ticket.status]?.icon ||
                    statusConfig[ticket.status?.toUpperCase()]?.icon ||
                    Clock;

                  return (
                    <div
                      key={ticket.id}
                      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-gray-500 font-mono text-sm">
                              {/* ❌ SAI - ticket.id là number, không có method substring */}
                              {/* ticket.id?.substring(0, 8) */}

                              {/* ✅ ĐÚNG - Convert sang string trước */}
                              {/* String(ticket.id).substring(0, 8) */}

                              {/* HOẶC dùng slice */}
                              {/* String(ticket.id).slice(0, 8) */}

                              {/* HOẶC hiển thị trực tiếp */}
                              {/* ticket.id */}

                              {/* HOẶC format với padding */}
                              {/* `#${String(ticket.id).padStart(8, '0')}` */}
                            </span>
                            <h3 className="text-xl font-bold text-gray-800">
                              {ticket.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <span
                              className={`px-3 py-1 text-xs rounded-full font-medium flex items-center gap-1 ${
                                statusConfig[ticket.status]?.color ||
                                statusConfig[ticket.status?.toUpperCase()]
                                  ?.color ||
                                "bg-gray-100 text-gray-700"
                              }`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig[ticket.status]?.label ||
                                statusConfig[ticket.status?.toUpperCase()]
                                  ?.label ||
                                ticket.status}
                            </span>
                            <span
                              className={`px-3 py-1 text-xs rounded-full font-medium ${
                                priorityConfig[ticket.priority]?.color ||
                                "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {priorityConfig[ticket.priority]?.label ||
                                ticket.priority}
                            </span>
                            <span className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full font-medium">
                              {categoryLabels[ticket.category] ||
                                ticket.category}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">
                            {ticket.description}
                          </p>
                          <p className="text-gray-400 text-sm">
                            📅 Tạo lúc:{" "}
                            {new Date(ticket.created_at).toLocaleString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Response */}
                      {ticket.response && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                          <p className="text-sm font-semibold text-blue-900 mb-1">
                            💬 Phản hồi từ Admin:
                          </p>
                          <p className="text-blue-800">{ticket.response}</p>
                          {ticket.resolved_at && (
                            <p className="text-blue-600 text-xs mt-2">
                              ✅ Giải quyết lúc:{" "}
                              {new Date(ticket.resolved_at).toLocaleString(
                                "vi-VN"
                              )}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleDelete(ticket.id)}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Xóa
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-500 text-lg mb-2">
                  Chưa có yêu cầu nào
                </p>
                <button
                  onClick={() => setActiveTab("create")}
                  className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  ➕ Tạo yêu cầu mới
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Tạo ticket mới */}
        {activeTab === "create" && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              ➕ Tạo yêu cầu mới
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tiêu đề */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  disabled={submitting}
                  placeholder="VD: Điều hòa phòng bị hỏng"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none disabled:bg-gray-100"
                />
              </div>

              {/* Category & Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    disabled={submitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none disabled:bg-gray-100"
                  >
                    <option value="general">Tổng quát</option>
                    <option value="maintenance">Bảo trì</option>
                    <option value="payment">Thanh toán</option>
                    <option value="contract">Hợp đồng</option>
                    <option value="complaint">Khiếu nại</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Độ ưu tiên
                  </label>
                  <select
                    value={form.priority}
                    onChange={(e) =>
                      setForm({ ...form, priority: e.target.value })
                    }
                    disabled={submitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none disabled:bg-gray-100"
                  >
                    <option value="low">Thấp</option>
                    <option value="normal">Bình thường</option>
                    <option value="high">Cao</option>
                    <option value="urgent">Khẩn cấp</option>
                  </select>
                </div>
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả chi tiết <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  required
                  disabled={submitting}
                  rows={6}
                  placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none disabled:bg-gray-100"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Đang gửi...
                    </>
                  ) : (
                    <>✉️ Gửi yêu cầu</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("tickets")}
                  disabled={submitting}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium disabled:opacity-50"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
