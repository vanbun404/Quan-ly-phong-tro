import express from "express";
import { registerLandlord } from "../modules/landlord.service.js";
import { getLandlordById } from "../modules/landlord.service.js";
const router = express.Router();

router.post("/register", registerLandlord);
router.get("/:id", async (req, res) => {
  try {
    const result = await getLandlordById(req, res);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
