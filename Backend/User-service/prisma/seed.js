// prisma/seed.js
import { PrismaClient } from "../src/generated/prisma/index.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const createRandomUsers = async (count = 90) => {
  console.log("🚀 Bắt đầu tạo người dùng mẫu...");

  for (let i = 11; i <= count; i++) {
    const email = `user${i}@gmail.com`;
    const password = await bcrypt.hash("12345678", 10);
    const name = `Người dùng ${i}`;
    const role = "USER"; // Đảm bảo trùng với enum trong Prisma schema

    await prisma.user.create({
      data: { email, password, name, role },
    });

    console.log(`✅ Đã tạo: ${email}`);
  }

  console.log(`🎉 Hoàn tất: ${count} người dùng đã được thêm.`);
};

createRandomUsers(90)
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error("❌ Lỗi khi seed:", err.message);
    prisma.$disconnect();
  });
