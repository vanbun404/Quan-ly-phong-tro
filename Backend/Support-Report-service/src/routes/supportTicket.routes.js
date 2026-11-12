const express = require("express");
const router = express.Router();
const supportTicketService = require("../modules/supportTicket.service");
const logger = require("../utils/logger");

// GET /api/support-tickets
router.get("/", async (req, res) => {
  try {
    const { userId, status } = req.query;
    logger.info(
      `GET /api/support-tickets - userId: ${userId}, status: ${status}`
    );

    const tickets = await supportTicketService.getAll(userId, status);

    // ✅ Response format chuẩn
    res.json({
      success: true,
      data: { tickets },
    });
  } catch (error) {
    logger.error("Error getting tickets:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// POST /api/support-tickets
router.post("/", async (req, res) => {
  try {
    logger.info("POST /api/support-tickets", req.body);

    // ✅ Validate required fields
    const { userId, title, description, category, priority } = req.body;
    if (!userId || !title || !description) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc (userId, title, description)",
      });
    }

    const ticket = await supportTicketService.create({
      ...req.body,
      userRole: req.body.userRole || "USER", // ✅ Default userRole
    });

    // ✅ Response format chuẩn
    res.status(201).json({
      success: true,
      message: "Tạo ticket thành công",
      data: { ticket },
    });
  } catch (error) {
    logger.error("Error creating ticket:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// PATCH /api/support-tickets/:id/status
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Thiếu status",
      });
    }

    logger.info(
      `PATCH /api/support-tickets/${id}/status - New status: ${status}`
    );

    const ticket = await supportTicketService.updateStatus(id, status);

    // ✅ Response format chuẩn
    res.json({
      success: true,
      message: "Cập nhật trạng thái thành công",
      data: { ticket },
    });
  } catch (error) {
    logger.error("Error updating ticket status:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// POST /api/support-tickets/:id/reply
router.post("/:id/reply", async (req, res) => {
  try {
    const { id } = req.params;
    const { message, userId } = req.body;

    if (!message || !userId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu message hoặc userId",
      });
    }

    logger.info(`POST /api/support-tickets/${id}/reply`);

    const ticket = await supportTicketService.reply(id, message, userId);

    // ✅ Response format chuẩn
    res.json({
      success: true,
      message: "Thêm phản hồi thành công",
      data: { ticket },
    });
  } catch (error) {
    logger.error("Error replying to ticket:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// DELETE /api/support-tickets/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    logger.info(`DELETE /api/support-tickets/${id}`);

    await supportTicketService.delete(id);

    // ✅ Response format chuẩn
    res.json({
      success: true,
      message: "Xóa ticket thành công",
    });
  } catch (error) {
    logger.error("Error deleting ticket:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
