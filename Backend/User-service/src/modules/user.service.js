import { PrismaClient } from "../../src/generated/prisma/index.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const registerUser = async (data) => {
  if (!data.email || !data.password)
    throw new Error("Thiếu email hoặc mật khẩu");

  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existing) throw new Error("Email đã tồn tại");

  const hashed = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashed,
      name: data.name || null,
      phone: data.phone || null,
    },
  });

  return { message: "Đăng ký người dùng thành công", user };
};
export const getUserById = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
  });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

export const getAllAccounts = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    const landlords = await prisma.landlord.findMany();
    const admins = await prisma.admin.findMany();

    const allAccounts = [
      ...users.map((u) => ({ ...u, type: "USER" })),
      ...landlords.map((l) => ({ ...l, type: "LANDLORD" })),
      ...admins.map((a) => ({ ...a, type: "ADMIN" })),
    ];

    res.status(200).json(allAccounts);
  } catch (error) {
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};
