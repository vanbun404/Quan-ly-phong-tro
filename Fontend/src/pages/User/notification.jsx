import React, { useState, useEffect } from "react";
import { Bell, Check, Trash2, Eye, Clock } from "lucide-react";
import {
  getNotifications,
  markAsRead as apiMarkAsRead,
  markAllAsRead as apiMarkAllAsRead,
  deleteNotification as apiDeleteNotification,
} from "../../api/notificationApi";

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  // 📡 Fetch notifications từ API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        console.error("User không tồn tại");
        return;
      }

      const response = await getNotifications(user.id);

      if (response.success) {
        setNotifications(response.data.notifications);
      } else {
        console.error("Lỗi khi fetch notifications:", response.message);
      }
    } catch (error) {
      console.error("Lỗi khi fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Đánh dấu đã đọc
  const markAsRead = async (id) => {
    try {
      const response = await apiMarkAsRead(id);
      if (response.success) {
        setNotifications(
          notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
      }
    } catch (error) {
      console.error("Lỗi khi mark as read:", error);
    }
  };

  // ✅ Đánh dấu tất cả đã đọc
  const markAllAsRead = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await apiMarkAllAsRead(user.id);

      if (response.success) {
        setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
      }
    } catch (error) {
      console.error("Lỗi khi mark all as read:", error);
    }
  };

  // 🗑️ Xóa thông báo
  const deleteNotification = async (id) => {
    try {
      const response = await apiDeleteNotification(id);
      if (response.success) {
        setNotifications(notifications.filter((n) => n.id !== id));
      }
    } catch (error) {
      console.error("Lỗi khi xóa thông báo:", error);
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "read") return n.isRead;
    return true;
  });

  // Icon theo loại thông báo
  const getTypeIcon = (type) => {
    switch (type) {
      case "payment":
        return "💰";
      case "contract":
        return "📄";
      case "support":
        return "🛠️";
      case "system":
        return "⚙️";
      default:
        return "📢";
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông báo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Bell className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-800">Thông báo</h1>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {unreadCount} mới
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <Check className="w-4 h-4" />
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>

          {/* Filter buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Tất cả ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "unread"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Chưa đọc ({unreadCount})
            </button>
            <button
              onClick={() => setFilter("read")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "read"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Đã đọc ({notifications.length - unreadCount})
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Không có thông báo nào</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl shadow-md p-6 transition hover:shadow-lg ${
                  !notification.isRead ? "border-l-4 border-indigo-600" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Icon */}
                    <div className="text-3xl flex-shrink-0">
                      {getTypeIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3
                          className={`font-bold text-lg ${
                            !notification.isRead
                              ? "text-gray-800"
                              : "text-gray-600"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded">
                            Mới
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {new Date(notification.createdAt).toLocaleString(
                          "vi-VN"
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 ml-4">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 hover:bg-green-50 rounded-lg transition"
                        title="Đánh dấu đã đọc"
                      >
                        <Eye className="w-5 h-5 text-green-600" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition"
                      title="Xóa"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
