const PayOS = require("@payos/node");
const crypto = require("crypto");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const payos = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

// ======================================
// 🎯 1️⃣ TẠO LINK THANH TOÁN
// ======================================
export async function createPaymentLink(roomId, roomPrice) {
  try {
    // 🧾 Mô tả thanh toán
    const description = `Coc tien nha #${roomId}`.slice(0, 25); // PayOS chỉ cho tối đa 25 ký tự

    // 🧾 Dữ liệu gửi sang PayOS
    const paymentData = {
      orderCode: Number(roomId),
      amount: Math.round(roomPrice), 
      description, 
      items: [
        {
          name: `Phòng trọ #${roomId}`,
          quantity: 1,
          price: Math.round(roomPrice),
        },
      ],
      returnUrl: process.env.PAYOS_RETURN_URL,
      cancelUrl: process.env.PAYOS_CANCEL_URL,
    };

    console.log("📦 Gửi sang PayOS:", paymentData);

    const response = await payos.createPaymentLink(paymentData);
    console.log("✅ Phản hồi PayOS:", response);

    return {
      message: "Tạo link thanh toán thành công",
      payment: response,
    };
  } catch (err) {
    console.error("❌ Lỗi tạo link thanh toán PayOS:", err.message);
    throw new Error("Không thể tạo link thanh toán PayOS");
  }
}

// ======================================
// 🧾 2️⃣ XÁC THỰC WEBHOOK
// ======================================
function verifyWebhook(reqBody) {
  const { data } = reqBody;
  if (!data?.signature) throw new Error("Thiếu chữ ký (signature)");

  const signatureReceived = data.signature;
  const cloned = { ...data };
  delete cloned.signature;

  const computedSignature = crypto
    .createHmac("sha256", process.env.PAYOS_CHECKSUM_KEY)
    .update(JSON.stringify(cloned))
    .digest("hex");

  if (signatureReceived !== computedSignature)
    throw new Error("Chữ ký webhook không hợp lệ!");

  console.log("✅ Webhook hợp lệ từ PayOS:", data);
  return data;
}

// ======================================
// 🔁 3️⃣ GỬI CẬP NHẬT TRẠNG THÁI SANG CONTRACT-SERVICE
// ======================================
async function notifyContractService(orderCode, status) {
  try {
    await axios.post("http://localhost:4005/contracts/update-status", {
      orderCode,
      status,
    });
    console.log(`📨 Đã gửi cập nhật ${status} cho hợp đồng #${orderCode}`);
  } catch (err) {
    console.error("⚠️ Không thể gửi cập nhật sang Contract-service:", err.message);
  }
}

// ======================================
// 🚀 4️⃣ HANDLER CHO ROUTE
// ======================================

// 🧩 /payments/create
async function handleCreatePayment(req, res) {
  try {
    const { roomId, amount, description } = req.body;

    if (!roomId || !amount) {
      return res.status(400).json({ error: "Thiếu roomId hoặc amount" });
    }

    const payment = await createPaymentLink(roomId, amount, description);
    return res.status(200).json({
      message: "Tạo link thanh toán thành công",
      payment,
    });
  } catch (err) {
    console.error("❌ Lỗi tạo link:", err.message);
    return res.status(400).json({ error: err.message });
  }
}

// 🧩 /payments/webhook
async function handleWebhook(req, res) {
  try {
    console.log("📩 Nhận callback từ PayOS:", req.body);
    const verifiedData = verifyWebhook(req.body);
    const { code, data } = req.body;

    if (code === "success") {
      console.log("💰 Thanh toán thành công:", data.orderCode);
      await notifyContractService(data.orderCode, "PAID");
    } else if (code === "cancel") {
      console.log("❌ Thanh toán bị hủy:", data.orderCode);
      await notifyContractService(data.orderCode, "CANCELLED");
    }

    return res.status(200).json({ message: "Webhook received" });
  } catch (err) {
    console.error("🚨 Lỗi xử lý webhook:", err.message);
    return res.status(400).json({ error: err.message });
  }
}


module.exports = {
  createPaymentLink,
  verifyWebhook,
  notifyContractService,
  handleCreatePayment,
  handleWebhook,
};
