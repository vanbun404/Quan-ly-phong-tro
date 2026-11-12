export const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err.message);
  if (err.message.includes("Email") || err.message.includes("Mật khẩu")) {
    return res.status(400).json({ success: false, message: err.message });
  }
  res.status(500).json({ success: false, message: "Lỗi hệ thống" });
};
