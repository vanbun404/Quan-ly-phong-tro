// Middleware xử lý lỗi tập trung
const errorHandler = (err, req, res, next) => {
  console.error(`❌ Error: ${err.message} | Path: ${req.method} ${req.path}`);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
