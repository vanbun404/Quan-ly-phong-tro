import express from "express";
import { upload, uploadSignature } from "../modules/signature.service.js";

const router = express.Router();

router.post("/upload", upload.single("signature"), uploadSignature);

export default router;
