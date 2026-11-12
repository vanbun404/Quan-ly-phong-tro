const express = require("express");
const router = express.Router();
const paymentService = require("../services/payment.service");

// 🎯 API tạo QR/link thanh toán
router.post("/create", paymentService.handleCreatePayment);

// 📩 Webhook callback từ PayOS
router.post("/webhook", paymentService.handleWebhook);

module.exports = router;
