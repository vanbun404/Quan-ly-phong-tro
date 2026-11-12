import { useState, useEffect } from "react";
import {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} from "../../api/notificationApi";
import {
  getSupportTickets,
  updateTicketStatus,
  deleteTicket,
  replyToTicket,
} from "../../api/supportReportApi";

// ==================== COMPONENTS ====================

const FilterButtons = ({ filters, active, onFilterChange }) => (
  <div className="flex gap-2">
    {filters.map(({ value, label }) => (
      <button
        key={value || "all"}
        onClick={() => onFilterChange(value)}
        className={`px-4 py-2 rounded-lg transition ${
          active === value
            ? "bg-indigo-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);

const Modal = ({ show, onClose, title, children }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const FormInput = ({
  label,
  type = "text",
  value,
  onChange,
  required = true,
  children,
  ...props
}) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    {type === "textarea" ? (
      <textarea
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border rounded-lg"
        required={required}
        {...props}
      />
    ) : type === "select" ? (
      <select
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border rounded-lg"
        required={required}
        {...props}
      >
        {children}
      </select>
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border rounded-lg"
        required={required}
        {...props}
      />
    )}
  </div>
);

const StatusBadge = ({ status, type = "ticket" }) => {
  const configs = {
    ticket: {
      open: "bg-yellow-100 text-yellow-800 border-yellow-300",
      in_progress: "bg-blue-100 text-blue-800 border-blue-300",
      resolved: "bg-green-100 text-green-800 border-green-300",
    },
    priority: {
      high: "bg-red-100 text-red-800 border-red-300",
      medium: "bg-orange-100 text-orange-800 border-orange-300",
      normal: "bg-gray-100 text-gray-800 border-gray-300",
      low: "bg-gray-100 text-gray-800 border-gray-300",
    },
  };

  const labels = {
    open: "Chờ xử lý",
    in_progress: "Đang xử lý",
    resolved: "Đã xong",
    high: "Ưu tiên cao",
    medium: "Trung bình",
    normal: "Bình thường",
    low: "Thấp",
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full border ${
        configs[type][status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {labels[status] || status}
    </span>
  );
};

// ==================== MAIN COMPONENT ====================

export default function NotificationManagement() {
  const [activeSection, setActiveSection] = useState("notifications");
  const [loading, setLoading] = useState(false);
  const adminId = "admin001";

  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filterRead, setFilterRead] = useState(null);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [notifForm, setNotifForm] = useState({
    userId: "",
    type: "SYSTEM",
    title: "",
    message: "",
    sendToAll: false, // ✅ Thêm option gửi cho tất cả
  });
  const [allUsers, setAllUsers] = useState([]); // ✅ Danh sách user

  // Tickets
  const [tickets, setTickets] = useState([]);
  const [filterTicketStatus, setFilterTicketStatus] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketDetailModal, setShowTicketDetailModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");

  // ==================== FETCH DATA ====================

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeSection === "notifications") {
          const [notifsData, countData] = await Promise.all([
            getNotifications(adminId, filterRead),
            getUnreadCount(adminId),
          ]);
          setNotifications(notifsData.notifications || []);
          setUnreadCount(countData.unreadCount || 0);
        } else if (activeSection === "support") {
          const data = await getSupportTickets(null, filterTicketStatus);
          console.log("📥 Support Tickets Response:", data); // ✅ Debug log

          // ✅ Fix: Đọc đúng nested structure
          if (data.success && data.data?.tickets) {
            setTickets(data.data.tickets);
          } else {
            setTickets([]);
            console.warn("⚠️ No tickets found or invalid response:", data);
          }
        }
      } catch (error) {
        console.error("❌ Fetch error:", error);
        if (activeSection === "support") setTickets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeSection, filterRead, filterTicketStatus]);

  // ==================== HANDLERS ====================

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowTicketDetailModal(true);
    setReplyMessage("");
  };

  const handleReplyTicket = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    const result = await replyToTicket(
      selectedTicket.id,
      replyMessage,
      adminId
    );
    if (!result.message) {
      alert("✅ Đã gửi phản hồi!");
      setReplyMessage("");
      setShowTicketDetailModal(false);
      setActiveSection("support");
    } else {
      alert("❌ " + result.message);
    }
  };

  const normalizeTicket = (ticket) => ({
    id: ticket.id,
    userId: ticket.userId || ticket.userid || ticket.user_id,
    userRole: ticket.userRole || ticket.userrole || ticket.user_role || "User",
    title: ticket.title || "Không có tiêu đề",
    description: ticket.description || "Không có nội dung",
    category: ticket.category,
    status: (ticket.status || "open").toLowerCase(),
    priority: (ticket.priority || "normal").toLowerCase(),
    response: ticket.response,
    assignedTo: ticket.assignedTo || ticket.assignedto,
    created_at: ticket.created_at || ticket.createdAt,
    updated_at: ticket.updated_at || ticket.updatedAt,
    resolved_at: ticket.resolved_at || ticket.resolvedAt,
  });

  const getNextStatus = (status) => {
    if (status === "open") return "in_progress";
    if (status === "in_progress") return "resolved";
    return null;
  };

  // ==================== RENDER ====================

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          📞 Quản lý Hỗ trợ & Thông báo
        </h1>
        <p className="text-gray-600 mt-2">
          Quản lý thông báo và support tickets
        </p>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mb-6">
        {[
          {
            key: "notifications",
            label: `🔔 Thông báo ${unreadCount > 0 ? `(${unreadCount})` : ""}`,
          },
          { key: "support", label: "🎫 Support Tickets" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveSection(key)}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeSection === key
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        ) : (
          <>
            {/* NOTIFICATIONS */}
            {activeSection === "notifications" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <FilterButtons
                    filters={[
                      { value: null, label: "Tất cả" },
                      { value: "false", label: "Chưa đọc" },
                      { value: "true", label: "Đã đọc" },
                    ]}
                    active={filterRead}
                    onFilterChange={setFilterRead}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        await markAllAsRead(adminId);
                        setActiveSection("notifications");
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      ✓ Đánh dấu tất cả
                    </button>
                    <button
                      onClick={() => setShowNotifModal(true)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      + Tạo mới
                    </button>
                  </div>
                </div>

                {notifications.length === 0 ? (
                  <p className="text-center text-gray-500 py-12">
                    Không có dữ liệu
                  </p>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-4 border rounded-lg ${
                          n.is_read
                            ? "bg-gray-50"
                            : "bg-blue-50 border-blue-300"
                        }`}
                      >
                        <div className="flex justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded">
                                {n.type}
                              </span>
                              {!n.is_read && (
                                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                              )}
                            </div>
                            <h3 className="font-semibold text-gray-800">
                              {n.title}
                            </h3>
                            <p className="text-gray-600 text-sm">{n.message}</p>
                            <p className="text-gray-400 text-xs mt-1">
                              {new Date(n.created_at).toLocaleString("vi-VN")}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {!n.is_read && (
                              <button
                                onClick={async () => {
                                  await markAsRead(n.id, adminId);
                                  setActiveSection("notifications");
                                }}
                                className="px-3 py-1 bg-green-600 text-white text-sm rounded"
                              >
                                ✓
                              </button>
                            )}
                            <button
                              onClick={async () => {
                                if (confirm("Xóa?")) {
                                  await deleteNotification(n.id, adminId);
                                  setActiveSection("notifications");
                                }
                              }}
                              className="px-3 py-1 bg-red-600 text-white text-sm rounded"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SUPPORT TICKETS */}
            {activeSection === "support" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <FilterButtons
                    filters={[
                      { value: null, label: "Tất cả" },
                      { value: "open", label: "Chờ xử lý" },
                      { value: "in_progress", label: "Đang xử lý" },
                      { value: "resolved", label: "Đã xong" },
                    ]}
                    active={filterTicketStatus}
                    onFilterChange={setFilterTicketStatus}
                  />
                  <div className="text-gray-600">
                    Tổng: <span className="font-bold">{tickets.length}</span>{" "}
                    tickets
                  </div>
                </div>

                {tickets.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📭</div>
                    <p className="text-gray-500 text-lg">
                      Không có yêu cầu hỗ trợ nào
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tickets.map((ticket) => {
                      const t = normalizeTicket(ticket);
                      const nextStatus = getNextStatus(t.status);

                      return (
                        <div
                          key={t.id}
                          className="p-4 border rounded-lg hover:shadow-md transition cursor-pointer"
                          onClick={() => handleViewTicket(t)}
                        >
                          <div className="flex justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-3 flex-wrap">
                                <span className="font-bold text-gray-700 text-lg">
                                  🎫 Ticket #{t.id}
                                </span>
                                <StatusBadge status={t.status} type="ticket" />
                                <StatusBadge
                                  status={t.priority}
                                  type="priority"
                                />
                                {t.category && (
                                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 border border-purple-300">
                                    📂 {t.category}
                                  </span>
                                )}
                              </div>

                              <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                                <p className="text-sm">
                                  <span className="text-gray-500">
                                    👤 Người gửi:
                                  </span>{" "}
                                  <span className="font-semibold text-gray-800">
                                    {t.userId}
                                  </span>{" "}
                                  <span className="text-gray-500">
                                    ({t.userRole})
                                  </span>
                                </p>
                              </div>

                              <h3 className="font-bold text-gray-900 mb-2 text-lg">
                                {t.title}
                              </h3>
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {t.description}
                              </p>

                              {t.response && (
                                <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg">
                                  <p className="text-xs font-semibold text-green-700 mb-1">
                                    ✓ Phản hồi từ Admin:
                                  </p>
                                  <p className="text-sm text-gray-800">
                                    {t.response}
                                  </p>
                                </div>
                              )}

                              <div className="mt-3 text-xs text-gray-400">
                                🕐{" "}
                                {t.created_at
                                  ? new Date(t.created_at).toLocaleString(
                                      "vi-VN"
                                    )
                                  : "N/A"}
                              </div>
                            </div>

                            <div
                              className="flex flex-col gap-2 ml-4"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => handleViewTicket(t)}
                                className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 font-medium"
                              >
                                👁️ Xem
                              </button>

                              {nextStatus && (
                                <button
                                  onClick={() => {
                                    updateTicketStatus(t.id, nextStatus);
                                    setActiveSection("support");
                                  }}
                                  className={`px-4 py-2 text-white text-sm rounded-lg font-medium ${
                                    t.status === "open"
                                      ? "bg-blue-600 hover:bg-blue-700"
                                      : "bg-green-600 hover:bg-green-700"
                                  }`}
                                >
                                  {t.status === "open"
                                    ? "▶️ Bắt đầu"
                                    : "✓ Hoàn thành"}
                                </button>
                              )}

                              {!nextStatus && (
                                <div className="px-4 py-2 bg-green-100 text-green-700 text-sm rounded-lg text-center font-bold">
                                  ✓ Đã xong
                                </div>
                              )}

                              <button
                                onClick={async () => {
                                  if (confirm(`Xóa ticket #${t.id}?`)) {
                                    await deleteTicket(t.id);
                                    setActiveSection("support");
                                  }
                                }}
                                className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 font-medium"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* MODAL CHI TIẾT TICKET */}
      <Modal
        show={showTicketDetailModal}
        onClose={() => setShowTicketDetailModal(false)}
        title={`Chi tiết Ticket #${selectedTicket?.id || ""}`}
      >
        {selectedTicket && (
          <div className="space-y-4">
            {[
              {
                label: "Người gửi",
                value: `${selectedTicket.userId} (${selectedTicket.userRole})`,
              },
              { label: "Tiêu đề", value: selectedTicket.title },
              { label: "Mô tả", value: selectedTicket.description },
              selectedTicket.category && {
                label: "Danh mục",
                value: selectedTicket.category,
              },
            ]
              .filter(Boolean)
              .map((field, i) => (
                <div key={i}>
                  <p className="text-sm text-gray-500">{field.label}</p>
                  <p className="font-medium text-gray-700">{field.value}</p>
                </div>
              ))}

            {selectedTicket.response && (
              <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded">
                <p className="text-sm text-green-700 font-medium mb-1">
                  Phản hồi trước:
                </p>
                <p className="text-gray-700">{selectedTicket.response}</p>
              </div>
            )}

            <form onSubmit={handleReplyTicket} className="space-y-3">
              <FormInput
                label="Phản hồi của Admin"
                type="textarea"
                rows="4"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Nhập phản hồi..."
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                >
                  Gửi
                </button>
                <button
                  type="button"
                  onClick={() => setShowTicketDetailModal(false)}
                  className="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400"
                >
                  Đóng
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>

      {/* MODAL TẠO THÔNG BÁO - ✅ CẬP NHẬT */}
      <Modal
        show={showNotifModal}
        onClose={() => {
          setShowNotifModal(false);
          setNotifForm({
            userId: "",
            type: "SYSTEM",
            title: "",
            message: "",
            sendToAll: false,
          });
        }}
        title="📨 Tạo thông báo mới"
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            try {
              if (notifForm.sendToAll) {
                // ✅ Gửi cho tất cả users
                let successCount = 0;
                let failCount = 0;

                for (const user of allUsers) {
                  const result = await createNotification({
                    userId: user.id,
                    type: notifForm.type,
                    title: notifForm.title,
                    message: notifForm.message,
                  });

                  if (!result.message) {
                    successCount++;
                  } else {
                    failCount++;
                  }
                }

                alert(
                  `✅ Đã gửi thành công cho ${successCount} người!\n${
                    failCount > 0 ? `❌ Thất bại: ${failCount}` : ""
                  }`
                );
              } else {
                // ✅ Gửi cho 1 user cụ thể
                const result = await createNotification({
                  userId: notifForm.userId,
                  type: notifForm.type,
                  title: notifForm.title,
                  message: notifForm.message,
                });

                if (!result.message) {
                  alert("✅ Gửi thông báo thành công!");
                } else {
                  alert("❌ " + result.message);
                }
              }

              setShowNotifModal(false);
              setNotifForm({
                userId: "",
                type: "SYSTEM",
                title: "",
                message: "",
                sendToAll: false,
              });
              setActiveSection("notifications");
            } catch (error) {
              console.error("❌ Send notification error:", error);
              alert("❌ Có lỗi xảy ra khi gửi thông báo!");
            }
          }}
          className="space-y-4"
        >
          {/* ✅ Checkbox: Gửi cho tất cả */}
          <div className="flex items-center gap-2 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
            <input
              type="checkbox"
              id="sendToAll"
              checked={notifForm.sendToAll}
              onChange={(e) =>
                setNotifForm({ ...notifForm, sendToAll: e.target.checked })
              }
              className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
            />
            <label
              htmlFor="sendToAll"
              className="text-sm font-medium text-indigo-800 cursor-pointer"
            >
              📢 Gửi cho tất cả người dùng ({allUsers.length} người)
            </label>
          </div>

          {/* ✅ Dropdown chọn User (ẩn nếu sendToAll = true) */}
          {!notifForm.sendToAll && (
            <FormInput
              label="🎯 Chọn người nhận"
              type="select"
              value={notifForm.userId}
              onChange={(e) =>
                setNotifForm({ ...notifForm, userId: e.target.value })
              }
              required
            >
              <option value="">-- Chọn người dùng --</option>
              {allUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username || user.fullName} ({user.email}) - {user.role}
                </option>
              ))}
            </FormInput>
          )}

          {/* ✅ Loại thông báo */}
          <FormInput
            label="📂 Loại thông báo"
            type="select"
            value={notifForm.type}
            onChange={(e) =>
              setNotifForm({ ...notifForm, type: e.target.value })
            }
          >
            <option value="SYSTEM">🔔 SYSTEM - Thông báo hệ thống</option>
            <option value="PAYMENT">💰 PAYMENT - Thanh toán</option>
            <option value="ROOM">🏠 ROOM - Phòng trọ</option>
            <option value="MAINTENANCE">🔧 MAINTENANCE - Bảo trì</option>
            <option value="ANNOUNCEMENT">
              📢 ANNOUNCEMENT - Thông báo chung
            </option>
          </FormInput>

          {/* ✅ Tiêu đề */}
          <FormInput
            label="✏️ Tiêu đề"
            value={notifForm.title}
            onChange={(e) =>
              setNotifForm({ ...notifForm, title: e.target.value })
            }
            placeholder="Nhập tiêu đề thông báo..."
            required
          />

          {/* ✅ Nội dung */}
          <FormInput
            label="📝 Nội dung"
            type="textarea"
            rows="5"
            value={notifForm.message}
            onChange={(e) =>
              setNotifForm({ ...notifForm, message: e.target.value })
            }
            placeholder="Nhập nội dung thông báo chi tiết..."
            required
          />

          {/* ✅ Preview */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">👁️ Xem trước:</p>
            <div className="bg-white p-3 rounded border border-gray-300">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded">
                  {notifForm.type}
                </span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">
                {notifForm.title || "(Chưa có tiêu đề)"}
              </h4>
              <p className="text-sm text-gray-600">
                {notifForm.message || "(Chưa có nội dung)"}
              </p>
            </div>
          </div>

          {/* ✅ Buttons */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              {notifForm.sendToAll ? "📢 Gửi cho tất cả" : "📨 Gửi thông báo"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowNotifModal(false);
                setNotifForm({
                  userId: "",
                  type: "SYSTEM",
                  title: "",
                  message: "",
                  sendToAll: false,
                });
              }}
              className="flex-1 bg-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
            >
              Hủy
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
