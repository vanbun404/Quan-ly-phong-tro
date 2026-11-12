import fs from "fs";
import path from "path";
import axios from "axios";
import { createCanvas, loadImage } from "canvas";
import { PrismaClient } from "../generated/prisma/index.js";
import cloudinary from "../utils/cloudinary.js";

const prisma = new PrismaClient();

// 🔧 Hàm tải ảnh chữ ký
const downloadImage = async (url, filepath) => {
  const response = await axios({
    url,
    responseType: "arraybuffer",
  });
  fs.writeFileSync(filepath, Buffer.from(response.data, "binary"));
};

// 🧾 Tạo hợp đồng dạng ảnh
export const generateContractImage = async (req, res) => {
  try {
    const { tenantId, roomId, ownerId, startDate, endDate } = req.body;

    if (!tenantId || !roomId || !ownerId || !startDate || !endDate) {
      return res.status(400).json({ message: "Thiếu thông tin hợp đồng" });
    }

    // 🔹 Lấy thông tin phòng
    const room = await prisma.room.findUnique({
      where: { id: Number(roomId) },
    });
    if (!room) return res.status(404).json({ message: "Phòng không tồn tại" });

    // 🔹 Lấy thông tin chủ trọ và người thuê
    const [tenantRes, ownerRes] = await Promise.all([
      axios.get(`http://localhost:3000/users/${tenantId}`),
      axios.get(`http://localhost:3000/landlords/${ownerId}`),
    ]);

    const tenant = tenantRes.data;
    const owner = ownerRes.data;

    // 🔹 Chuẩn bị thư mục tạm
    const tempDir = path.join(process.cwd(), "src", "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    // 🖼️ Tạo canvas khổ A4
    const width = 900;
    const height = 1200;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Nền trắng
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Chữ đen
    ctx.fillStyle = "#000000";
    ctx.font = "18px Arial";
    ctx.textAlign = "left";

    // ==== ✨ Tiêu đề ====
    ctx.fillStyle = "#000000";
    ctx.font = "bold 26px Arial";
    ctx.textAlign = "center";
    ctx.fillText("HỢP ĐỒNG THUÊ PHÒNG", width / 2, 100);
    ctx.font = "18px Arial";
    ctx.fillText("========================", width / 2, 125);

    // ==== 📝 Nội dung chính ====
    ctx.textAlign = "left";
    ctx.font = "16px Arial";
    let y = 180;
    const left = 100;
    const lineGap = 32;

    const lines = [
      `BÊN CHO THUÊ (BÊN A):`,
      `Họ và tên: ${owner.name}`,
      `Địa chỉ: ${owner.address || "Không có"}`,
      `Số điện thoại: ${owner.phone || "Không có"}`,
      "",
      `BÊN THUÊ (BÊN B):`,
      `Họ và tên: ${tenant.name}`,
      `Địa chỉ: ${tenant.address || "Không có"}`,
      `Số điện thoại: ${tenant.phone || "Không có"}`,
      "",
      `THÔNG TIN PHÒNG:`,
      `Phòng: ${room.title}`,
      `Địa chỉ: ${room.address}`,
      `Giá thuê: ${room.price.toLocaleString()} VND/tháng`,
      `Thời hạn thuê: ${startDate} đến ${endDate}`,
      "",
      `Hai bên cam kết thực hiện đúng các điều khoản của hợp đồng.`,
      "",
      `Ngày lập: ${new Date().toLocaleDateString("vi-VN")}`,
    ];

    for (const line of lines) {
      ctx.fillText(line, left, y);
      y += lineGap;
    }

    // ==== ✍️ Phần chữ ký ====
    y += 60;
    ctx.font = "bold 16px Arial";
    ctx.fillText("CHỮ KÝ:", left, y);
    y += 40;

    ctx.font = "16px Arial";
    ctx.fillText("Chủ trọ ký:", left + 50, y);
    ctx.fillText("Người thuê ký:", left + 550, y);

    // ==== ✍️ Vẽ khung chữ ký ====
    ctx.strokeStyle = "#999";
    ctx.lineWidth = 1;
    ctx.strokeRect(left + 30, y + 15, 200, 100);
    ctx.strokeRect(left + 530, y + 15, 200, 100);

    // ==== 🖋️ Chèn chữ ký ảnh nếu có ====
    if (owner.signaturePath) {
      const ownerSig = path.join(tempDir, `owner_${Date.now()}.png`);
      await downloadImage(owner.signaturePath, ownerSig);
      const sig = await loadImage(ownerSig);
      ctx.drawImage(sig, left + 35, y + 25, 180, 80);
      fs.unlinkSync(ownerSig);
    }
    if (tenant.signaturePath) {
      const tenantSig = path.join(tempDir, `tenant_${Date.now()}.png`);
      await downloadImage(tenant.signaturePath, tenantSig);
      const sig = await loadImage(tenantSig);
      ctx.drawImage(sig, left + 535, y + 25, 180, 80);
      fs.unlinkSync(tenantSig);
    }

    // 📁 Lưu ảnh tạm
    const imgPath = path.join(tempDir, `contract_${Date.now()}.png`);
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(imgPath, buffer);

    // ☁️ Upload Cloudinary (dạng image)
    const uploadResult = await cloudinary.uploader.upload(imgPath, {
      folder: "contracts",
      resource_type: "image", // public mặc định
    });

    // 🧹 Xoá file tạm
    fs.unlinkSync(imgPath);

    // 💾 Lưu DB
    const contract = await prisma.contract.create({
      data: {
        tenantId: Number(tenantId),
        roomId: Number(roomId),
        ownerId: Number(ownerId),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalPrice: Number(room.price),
        pdfPath: uploadResult.secure_url, // đường dẫn ảnh
      },
    });

    return res.status(201).json({
      message: "✅ Tạo hợp đồng ảnh và upload lên Cloudinary thành công",
      cloudinaryUrl: uploadResult.secure_url,
      contract,
    });
  } catch (error) {
    console.error("❌ Lỗi khi tạo hợp đồng:", error);
    return res.status(500).json({ message: error.message });
  }
};
