require("dotenv").config({ path: "./prisma/.env" });
const express = require("express");
const cors = require("cors");
const supportTicketRoutes = require("./routes/supportTicket.routes");
const reportRoutes = require("./routes/report.routes");
const errorHandler = require("./middlewares/errorHandler.middleware");
const logger = require("./utils/logger");

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Log mỗi request
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/support-tickets", supportTicketRoutes);
app.use("/api/reports", reportRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Support-Report Service",
    timestamp: new Date(),
  });
});

// 404 handler
app.use((req, res) => {
  logger.warn("Route not found", { path: req.path });
  res.status(404).json({ error: "Route not found" });
});

// Error handler (cuối cùng)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.success(`Server running on port http://localhost:${PORT}`);
});

module.exports = app;
