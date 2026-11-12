const logger = require("../utils/logger");

// Validate tạo ticket
const validateCreateTicket = (req, res, next) => {
  const { userId, userRole, title } = req.body;
  const errors = [];

  if (!userId?.trim()) errors.push("userId is required");
  if (!["TENANT", "LANDLORD", "ADMIN"].includes(userRole)) {
    errors.push("userRole must be TENANT, LANDLORD, or ADMIN");
  }
  if (!title?.trim()) errors.push("title is required");

  if (errors.length > 0) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: errors });
  }
  next();
};

// Validate tạo report
const validateCreateReport = (req, res, next) => {
  const { reporterId, reporterRole, reportType, title } = req.body;
  const errors = [];

  if (!reporterId?.trim()) errors.push("reporterId is required");
  if (!["TENANT", "LANDLORD"].includes(reporterRole)) {
    errors.push("reporterRole must be TENANT or LANDLORD");
  }
  if (!reportType?.trim()) errors.push("reportType is required");
  if (!title?.trim()) errors.push("title is required");

  if (errors.length > 0) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: errors });
  }
  next();
};

// Validate ID
const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  next();
};

// Validate userId
const validateUserId = (req, res, next) => {
  const { userId } = req.body;
  if (!userId?.trim()) {
    return res.status(400).json({ error: "userId is required" });
  }
  next();
};

// Validate query params
const validateQueryParams = (req, res, next) => {
  const { limit, offset } = req.query;

  if (limit && (isNaN(parseInt(limit)) || parseInt(limit) <= 0)) {
    return res.status(400).json({ error: "limit must be a positive number" });
  }

  if (offset && (isNaN(parseInt(offset)) || parseInt(offset) < 0)) {
    return res
      .status(400)
      .json({ error: "offset must be a non-negative number" });
  }

  next();
};

module.exports = {
  validateCreateTicket,
  validateCreateReport,
  validateId,
  validateUserId,
  validateQueryParams,
};
