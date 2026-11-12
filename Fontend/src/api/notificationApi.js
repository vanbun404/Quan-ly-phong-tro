import axios from "axios";

const BASE_URL = "http://localhost:6000"; // URL của Notification-service backend

/**
 * Lấy tất cả notifications của user
 */
export const getNotifications = async (userId, isRead = null) => {
  try {
    const params = { userId };
    if (isRead !== null) params.isRead = isRead;

    const res = await axios.get(`${BASE_URL}/api/notifications`, { params });
    return res.data;
  } catch (err) {
    return err.response?.data || { message: "Server error" };
  }
};

/**
 * Đếm số notification chưa đọc
 */
export const getUnreadCount = async (userId) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/notifications/unread-count`, {
      params: { userId },
    });
    return res.data;
  } catch (err) {
    return err.response?.data || { message: "Server error" };
  }
};

/**
 * Tạo notification mới (Admin gửi thông báo cho user)
 */
export const createNotification = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/api/notifications`, data);
    return res.data;
  } catch (err) {
    return err.response?.data || { message: "Server error" };
  }
};

/**
 * Đánh dấu notification đã đọc
 */
export const markAsRead = async (notificationId, userId) => {
  try {
    const res = await axios.patch(
      `${BASE_URL}/api/notifications/${notificationId}/read`,
      { userId }
    );
    return res.data;
  } catch (err) {
    return err.response?.data || { message: "Server error" };
  }
};

/**
 * Đánh dấu tất cả notifications đã đọc
 */
export const markAllAsRead = async (userId) => {
  try {
    const res = await axios.patch(`${BASE_URL}/api/notifications/read-all`, {
      userId,
    });
    return res.data;
  } catch (err) {
    return err.response?.data || { message: "Server error" };
  }
};

/**
 * Xóa notification
 */
export const deleteNotification = async (notificationId, userId) => {
  try {
    const res = await axios.delete(
      `${BASE_URL}/api/notifications/${notificationId}`,
      { data: { userId } }
    );
    return res.data;
  } catch (err) {
    return err.response?.data || { message: "Server error" };
  }
};
