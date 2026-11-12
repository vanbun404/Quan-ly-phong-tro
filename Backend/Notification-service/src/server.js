require("dotenv").config({ path: "./prisma/.env" });
const express = require("express");
const cors = require("cors");
const notificationRoutes = require("./routes/notification.routes"); // ✅ Sửa tên file
const errorHandler = require("./middlewares/errorHandler.middleware");

const app = express();
const PORT = process.env.PORT || 6000;

// Middlewares
app.use(cors());
app.use(express.json());

// Log requests
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/notifications", notificationRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Notification Service",
    timestamp: new Date(),
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`⚠️  404: ${req.method} ${req.path}`);
  res.status(404).json({ error: "Route not found" });
});

// Error handler (phải để cuối cùng)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🔔 Notification Service running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
});

module.exports = app;
