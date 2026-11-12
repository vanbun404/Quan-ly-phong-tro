import { PrismaClient } from "../../src/generated/prisma/index.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập email và mật khẩu" });
    }


    let user =
      (await prisma.user.findUnique({ where: { email } })) ||
      (await prisma.landlord.findUnique({ where: { email } })) ||
      (await prisma.admin.findUnique({ where: { email } }));

    if (!user) {
      return res
        .status(404)
        .json({ message: "Email không tồn tại trong hệ thống" });
    }


    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Sai mật khẩu" });
    }


    let role = "USER";
    if (await prisma.landlord.findUnique({ where: { email } }))
      role = "LANDLORD";
    if (await prisma.admin.findUnique({ where: { email } })) role = "ADMIN";


    return res.status(200).json({
      message: "Đăng nhập thành công ✅",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role,
      },
    });
  } catch (error) {
    console.error("🔥 Lỗi khi đăng nhập:", error);
    return res.status(500).json({ message: "Lỗi server khi đăng nhập" });
  }
};
