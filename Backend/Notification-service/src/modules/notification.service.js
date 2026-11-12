const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class NotificationService {
  // Tạo notification
  async create(data) {
    // ✅ Đóng gói tất cả data vào payload
    const payload = {
      userId: data.userId,
      title: data.title,
      message: data.message,
      data: data.data || null,
    };

    return await prisma.notification.create({
      data: {
        type: data.type, // ✅ Chỉ có type
        payload: payload, // ✅ Tất cả info vào payload
        isRead: false,
        createdAt: new Date(),
      },
    });
  }

  // Lấy tất cả của user
  async getAll(userId, isRead) {
    const where = {};

    // ✅ Filter theo userId trong payload
    if (userId) {
      where.payload = {
        path: ["userId"],
        equals: userId,
      };
    }

    // ✅ Filter theo isRead
    if (isRead !== undefined) {
      where.isRead = isRead === "true";
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    // ✅ Parse payload ra ngoài để Frontend dễ dùng
    return notifications.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.payload?.title || "",
      message: n.payload?.message || "",
      user_id: n.payload?.userId || "",
      data: n.payload?.data || null,
      is_read: n.isRead,
      read_at: n.payload?.readAt || null,
      created_at: n.createdAt,
    }));
  }

  // Đếm chưa đọc
  async getUnreadCount(userId) {
    const count = await prisma.notification.count({
      where: {
        isRead: false,
        payload: {
          path: ["userId"],
          equals: userId,
        },
      },
    });
    return { unreadCount: count };
  }

  // Đánh dấu đã đọc
  async markAsRead(id, userId) {
    const notification = await prisma.notification.findUnique({
      where: { id: parseInt(id) },
    });

    if (!notification) {
      throw new Error("Notification not found");
    }

    // ✅ Kiểm tra userId trong payload
    if (notification.payload?.userId !== userId) {
      throw new Error("Unauthorized");
    }

    // ✅ Update payload để thêm readAt
    const updatedPayload = {
      ...notification.payload,
      readAt: new Date(),
    };

    return await prisma.notification.update({
      where: { id: parseInt(id) },
      data: {
        isRead: true,
        payload: updatedPayload,
      },
    });
  }

  // Đánh dấu tất cả đã đọc
  async markAllAsRead(userId) {
    // ✅ Lấy tất cả notification của user
    const notifications = await prisma.notification.findMany({
      where: {
        isRead: false,
        payload: {
          path: ["userId"],
          equals: userId,
        },
      },
    });

    // ✅ Update từng cái
    const updates = notifications.map((n) =>
      prisma.notification.update({
        where: { id: n.id },
        data: {
          isRead: true,
          payload: {
            ...n.payload,
            readAt: new Date(),
          },
        },
      })
    );

    await Promise.all(updates);
    return { count: updates.length };
  }

  // Xóa notification
  async delete(id, userId) {
    const notification = await prisma.notification.findUnique({
      where: { id: parseInt(id) },
    });

    if (!notification) {
      throw new Error("Notification not found");
    }

    // ✅ Kiểm tra userId trong payload
    if (notification.payload?.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await prisma.notification.delete({ where: { id: parseInt(id) } });
    return { success: true, message: "Deleted successfully" };
  }
}

module.exports = new NotificationService();
