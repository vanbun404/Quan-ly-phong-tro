import { PrismaClient } from "../generated/prisma/index.js";
import cloudinary from "../utils/cloudinary.js";

const prisma = new PrismaClient();

export const createRoom = async (req, res) => {
  try {
    const { title, description, price, area, address, ownerId } = req.body;
    let uploadedUrls = [];

    // 🧩 Kiểm tra có file không
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "rooms",
              resource_type: "image",
              transformation: [
                { width: 800, height: 600, crop: "fill", quality: "auto" }, // ✅ resize ảnh trước khi lưu
              ],
            },
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });

        // ✅ Dùng link nén + resize tự động
        uploadedUrls.push(result.secure_url);
      }
    }

    // ✅ Tạo bản ghi phòng
    const room = await prisma.room.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        area: parseFloat(area),
        address,
        imageUrls: uploadedUrls, // mảng string
        ownerId: parseInt(ownerId),
      },
    });

    res.status(201).json({
      message: "✅ Phòng đã được thêm thành công!",
      room,
    });
  } catch (error) {
    console.error("❌ Lỗi khi thêm phòng:", error);
    res.status(500).json({ message: "Lỗi server khi thêm phòng" });
  }
};

export const getAllRooms = async (req, res) => {
  try {
    const { location, type, minPrice, maxPrice, ownerId } = req.query;

    const filters = {};

    if (location) {
      filters.address = {
        contains: location,
        mode: "insensitive",
      };
    }

    if (type) {
      filters.title = {
        contains: type,
        mode: "insensitive",
      };
    }

    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.gte = parseFloat(minPrice);
      if (maxPrice) filters.price.lte = parseFloat(maxPrice);
    }

    if (ownerId) {
      filters.ownerId = parseInt(ownerId);
    }

    const rooms = await prisma.room.findMany({
      where: filters,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        area: true,
        address: true,
        imageUrls: true,
        ownerId: true,
        createdAt: true,
      },
    });

    res.status(200).json(rooms);
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách phòng:", error);
    res.status(500).json({ message: "Lỗi server khi lấy phòng" });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const roomId = Number(req.params.id);

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        area: true,
        address: true,
        imageUrls: true,
        ownerId: true, // ✅ Lấy ownerId
        createdAt: true,
      },
    });

    if (!room) {
      return res.status(404).json({ message: "Không tìm thấy phòng" });
    }

    res.status(200).json(room);
  } catch (error) {
    console.error("❌ Lỗi khi lấy phòng:", error);
    res.status(500).json({ message: "Lỗi server khi lấy phòng" });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const roomId = Number(req.params.id);
    const { title, description, price, area, address, status } = req.body;

    const existingRoom = await prisma.room.findUnique({
      where: { id: roomId },
    });
    if (!existingRoom)
      return res.status(404).json({ message: "Không tìm thấy phòng" });

    // Upload ảnh mới (nếu có)
    let uploadedUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "rooms" },
            (err, result) => {
              if (err) reject(err);
              else {
                uploadedUrls.push(result.secure_url);
                resolve(result);
              }
            }
          );
          stream.end(file.buffer);
        });
      }
    }

    const finalImages =
      uploadedUrls.length > 0 ? uploadedUrls : existingRoom.imageUrls;

    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: {
        title: title ?? existingRoom.title,
        description: description ?? existingRoom.description,
        price: price ? parseFloat(price) : existingRoom.price,
        area: area ? parseFloat(area) : existingRoom.area,
        address: address ?? existingRoom.address,
        status: status ?? existingRoom.status,
        imageUrls: finalImages,
      },
    });

    res.status(200).json({
      message:
        uploadedUrls.length > 0
          ? "Cập nhật phòng và ảnh thành công!"
          : "Cập nhật thông tin phòng thành công!",
      room: updatedRoom,
    });
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật phòng:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật phòng" });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const roomId = Number(req.params.id);
    const existingRoom = await prisma.room.findUnique({
      where: { id: roomId },
    });
    if (!existingRoom)
      return res.status(404).json({ message: "Không tìm thấy phòng để xóa" });

    await prisma.room.delete({ where: { id: roomId } });
    res.status(200).json({ message: "🗑️ Đã xóa phòng thành công" });
  } catch (error) {
    console.error("❌ Lỗi khi xóa phòng:", error);
    res.status(500).json({ message: "Lỗi server khi xóa phòng" });
  }
};

export const getRoomsByOwner = async (req, res) => {
  try {
    const ownerId = Number(req.params.ownerId);
    const rooms = await prisma.room.findMany({
      where: { ownerId },
      orderBy: { createdAt: "desc" },
    });

    if (rooms.length === 0)
      return res.status(404).json({ message: "Chủ nhà chưa có phòng nào" });

    res.status(200).json(rooms);
  } catch (error) {
    console.error("❌ Lỗi khi lấy phòng theo chủ nhà:", error);
    res.status(500).json({ message: "Lỗi server khi lấy phòng" });
  }
};

export const updateRoomStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatus = ["available", "occupied", "maintenance"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({
        message: "Trạng thái không hợp lệ (available, occupied, maintenance)",
      });
    }

    const updated = await prisma.room.update({
      where: { id: Number(id) },
      data: { status },
    });

    res
      .status(200)
      .json({ message: "✅ Cập nhật trạng thái thành công", room: updated });
  } catch (error) {
    console.error("❌ Lỗi cập nhật trạng thái phòng:", error);
    res
      .status(500)
      .json({ message: "Lỗi server khi cập nhật trạng thái phòng" });
  }
};

export const getLatestRooms = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;

    const rooms = await prisma.room.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        area: true,
        address: true,
        imageUrls: true,
        createdAt: true,
        status: true,
      },
    });

    res.status(200).json(rooms);
  } catch (error) {
    console.error("❌ Lỗi khi lấy phòng mới nhất:", error.message);
    res.status(500).json({ message: error.message, stack: error.stack });
  }
};
