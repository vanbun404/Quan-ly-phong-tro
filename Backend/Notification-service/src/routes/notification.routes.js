const express = require("express");
const router = express.Router();
const notificationService = require("../modules/notification.service"); // ✅ Sửa path

// GET /api/notifications?userId=xxx&isRead=false - Lấy tất cả notifications
router.get("/", async (req, res, next) => {
  try {
    const { userId, isRead } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const notifications = await notificationService.getAll(userId, isRead);
    res.json({ notifications });
  } catch (error) {
    next(error);
  }
});

// GET /api/notifications/unread-count?userId=xxx - Đếm chưa đọc
router.get("/unread-count", async (req, res, next) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const result = await notificationService.getUnreadCount(userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// POST /api/notifications - Tạo notification mới
router.post("/", async (req, res, next) => {
  try {
    const { userId, type, title, message, data } = req.body;

    if (!userId || !type || !title || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const notification = await notificationService.create({
      userId,
      type,
      title,
      message,
      data,
    });

    res.status(201).json(notification);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/notifications/:id/read - Đánh dấu đã đọc
router.patch("/:id/read", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const notification = await notificationService.markAsRead(id, userId);
    res.json(notification);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/notifications/read-all - Đánh dấu tất cả đã đọc
router.patch("/read-all", async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const result = await notificationService.markAllAsRead(userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/notifications/:id - Xóa notification
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const result = await notificationService.delete(id, userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
