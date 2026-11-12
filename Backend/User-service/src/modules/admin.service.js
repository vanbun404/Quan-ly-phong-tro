import { PrismaClient } from "../../src/generated/prisma/index.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const registerAdmin = async (data) => {
  if (!data.email || !data.password)
    throw new Error("Thiếu email hoặc mật khẩu");

  const existing = await prisma.admin.findUnique({
    where: { email: data.email },
  });
  if (existing) throw new Error("Email đã tồn tại");

  const hashed = await bcrypt.hash(data.password, 10);
  const admin = await prisma.admin.create({
    data: {
      email: data.email,
      password: hashed,
      name: data.name || null,
      isSuper: data.isSuper || false,
    },
  });

  return { message: "Đăng ký admin thành công", admin };
};
