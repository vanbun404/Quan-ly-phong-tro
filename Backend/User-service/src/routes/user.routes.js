import express from "express";
import {
  registerUser,
  getUserById,
  getAllAccounts,
} from "../modules/user.service.js";
const router = express.Router();

// Đăng ký user mới
router.post("/register", async (req, res) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Lấy tất cả tài khoản (user, landlord, admin)
router.get("/all", async (req, res) => {
  try {
    await getAllAccounts(req, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy user theo id
router.get("/:id", async (req, res) => {
  try {
    await getUserById(req, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
