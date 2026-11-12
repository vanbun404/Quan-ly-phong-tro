// src/server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// 🧩 Routes
const paymentRoutes = require("./routes/payment.routes");
const bankConfigRoutes = require("./routes/bankConfig.routes");

const PayOS = require("@payos/node");

dotenv.config();

const payos = new PayOS({
  clientId: process.env.PAYOS_CLIENT_ID,
  apiKey: process.env.PAYOS_API_KEY,
  checksumKey: process.env.PAYOS_CHECKSUM_KEY,
});

console.log("🔑 PAYOS_CLIENT_ID:", process.env.PAYOS_CLIENT_ID);

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.locals.payos = payos;

app.use("/payments", paymentRoutes);
app.use("/bank-config", bankConfigRoutes);

// ===============================
// 🔄 Các route test / callback
// ===============================
app.get("/payment/success", (req, res) => {
  res.send("✅ Thanh toán thành công!");
});

app.get("/payment/cancel", (req, res) => {
  res.send("❌ Thanh toán bị hủy hoặc lỗi.");
});

app.post("/payment/webhook", (req, res) => {
  console.log("📩 PayOS gửi callback:", req.body);
  res.status(200).json({ message: "ok" });
});

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`💳 Payment-service đang chạy tại http://localhost:${PORT}`);
});
