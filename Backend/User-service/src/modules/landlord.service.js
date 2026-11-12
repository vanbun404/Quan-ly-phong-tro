import { PrismaClient } from "../../src/generated/prisma/index.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const registerLandlord = async (req, res) => {
  try {
    const data = req.body;
    console.log("📦 Dữ liệu nhận được từ client:", data);

    // 1️⃣ Kiểm tra dữ liệu đầu vào
    if (!data.email?.trim() || !data.password?.trim()) {
      return res.status(400).json({ message: "Thiếu email hoặc mật khẩu" });
    }

    // 2️⃣ Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return res.status(400).json({ message: "Định dạng email không hợp lệ" });
    }

    // 3️⃣ Kiểm tra email tồn tại trong 3 bảng
    const [existingUser, existingLandlord, existingAdmin] = await Promise.all([
      prisma.user.findUnique({ where: { email: data.email } }),
      prisma.landlord.findUnique({ where: { email: data.email } }),
      prisma.admin.findUnique({ where: { email: data.email } }),
    ]);

    if (existingUser || existingLandlord || existingAdmin) {
      return res.status(400).json({ message: "Email đã tồn tại trong hệ thống" });
    }

    // 4️⃣ Kiểm tra độ mạnh mật khẩu
    if (data.password.length < 8) {
      return res.status(400).json({ message: "Mật khẩu phải có ít nhất 8 ký tự" });
    }

    // 5️⃣ Mã hoá mật khẩu
    const hashed = await bcrypt.hash(data.password, 10);

    // 6️⃣ Tạo landlord mới
    const landlord = await prisma.landlord.create({
      data: {
        email: data.email.trim(),
        password: hashed,
        name: data.name?.trim() || null,
        phone: data.phone?.trim() || null,
        address: data.address?.trim() || null,
      },
    });

    // 7️⃣ Trả kết quả
    return res.status(201).json({
      message: "Đăng ký landlord thành công",
      landlord: {
        id: landlord.id,
        email: landlord.email,
        name: landlord.name,
        phone: landlord.phone,
        address: landlord.address,
      },
    });
  } catch (err) {
    console.error("❌ Lỗi khi đăng ký landlord:", err);
    return res.status(500).json({ message: err.message });
  }
};


export const getLandlordById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID không hợp lệ" });
    }
    const landlord = await prisma.landlord.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        signaturePath: true,
      },
    });
    if (!landlord) {
      return res.status(404).json({ error: "Chủ nhà không tồn tại" });
    }
    res.status(200).json(landlord);
  } catch (error) {
    console.error("lỗi:",error)
    res.status(500).json({ error : error.message});
  }
};
