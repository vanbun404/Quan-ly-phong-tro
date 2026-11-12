import express from "express";
import upload from "../utils/multer.js";
import {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  getRoomsByOwner,
  updateRoomStatus,
  getLatestRooms,
} from "../modules/room.service.js";

const router = express.Router();

router.post("/", upload.array("images", 5), createRoom);
router.get("/", getAllRooms);
router.get("/latest", getLatestRooms);
router.get("/search/:id", getRoomById);
router.put("/:id", upload.array("images", 5), updateRoom);
router.delete("/:id", deleteRoom);
router.get("/owner/:ownerId", getRoomsByOwner);
router.patch("/:id/status", updateRoomStatus);
router.get("/latest", getLatestRooms);
export default router;
