import express from "express";
import { login } from "../modules/auth.service.js";

const router = express.Router();

// POST /auth/login
router.post("/", login);

export default router;
