// src/routes/bankConfig.routes.js
const express = require("express");
const router = express.Router();

const {
  upsertBankConfig,
  getBankConfig,
} = require("../services/bankConfig.service");

// 🧭 Routes cấu hình ngân hàng
router.get("/:landlordId", getBankConfig);
router.post("/", upsertBankConfig);

module.exports = router;
