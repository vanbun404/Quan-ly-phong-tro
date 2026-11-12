const express = require("express");
const router = express.Router();
const reportService = require("../modules/report.service");
const {
  validateCreateReport,
  validateId,
  validateUserId,
} = require("../middlewares/validation.middleware");

// GET /api/reports - Lấy tất cả reports
router.get("/", async (req, res, next) => {
  try {
    const result = await reportService.getAllReports(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// GET /api/reports/:id - Lấy report theo ID
router.get("/:id", validateId, async (req, res, next) => {
  try {
    const report = await reportService.getReportById(req.params.id);
    res.json(report);
  } catch (error) {
    next(error);
  }
});

// POST /api/reports - Tạo report mới
router.post("/", validateCreateReport, async (req, res, next) => {
  try {
    const report = await reportService.createReport(req.body);
    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/reports/:id - Cập nhật report (gộp resolve, dismiss)
router.patch("/:id", validateId, async (req, res, next) => {
  try {
    const report = await reportService.updateReport(req.params.id, req.body);
    res.json(report);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/reports/:id - Xóa report
router.delete("/:id", validateId, validateUserId, async (req, res, next) => {
  try {
    const { userId, userRole } = req.body;

    if (!userRole) {
      return res.status(400).json({ error: "userRole is required" });
    }

    const result = await reportService.deleteReport(
      req.params.id,
      userId,
      userRole
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
