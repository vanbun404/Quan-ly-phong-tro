import express from "express";
import { registerAdmin } from "../modules/admin.service.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const result = await registerAdmin(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
