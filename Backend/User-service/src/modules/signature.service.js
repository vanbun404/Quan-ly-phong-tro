import { PrismaClient } from "../generated/prisma/index.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../utils/cloudinary.js";

const prisma = new PrismaClient();

// ⚙️ Cấu hình Multer + Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "signatures",
    allowed_formats: ["png", "jpg", "jpeg"],
    transformation: [{ width: 600, crop: "limit" }],
  },
});

export const upload = multer({ storage });

// 🧠 Upload chữ ký lên Cloudinary và lưu DB
export const uploadSignature = async (req, res) => {
  try {
    const { role, id } = req.body; // 🧩 Lấy role và id từ body

    if (!role || !id) {
      return res.status(400).json({ message: "Thiếu role hoặc id người dùng" });
    }

    if (!req.file?.path)
      return res.status(400).json({ message: "Không có file hợp lệ" });

    const signatureUrl = req.file.path; // URL Cloudinary
    let updated;

    // 🧩 Cập nhật chữ ký dựa vào role
    if (role.toUpperCase() === "USER") {
      updated = await prisma.user.update({
        where: { id: Number(id) },
        data: { signaturePath: signatureUrl },
      });
    } else if (role.toUpperCase() === "LANDLORD") {
      updated = await prisma.landlord.update({
        where: { id: Number(id) },
        data: { signaturePath: signatureUrl },
      });
    } else {
      return res.status(400).json({
        message: "Role không hợp lệ! Chỉ chấp nhận 'USER' hoặc 'LANDLORD'.",
      });
    }

    res.status(200).json({
      message: "Upload chữ ký thành công!",
      signatureUrl,
      updated,
    });
  } catch (err) {
    console.error("❌ Lỗi upload chữ ký:", err);
    res.status(500).json({ error: err.message });
  }
};
