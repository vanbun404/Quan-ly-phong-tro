import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import landlordRoutes from "./routes/landlord.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import signatureRoutes from "./routes/signature.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/landlords", landlordRoutes);
app.use("/admins", adminRoutes);
app.use("/login", authRoutes);
app.use("/signatures", signatureRoutes);
// Middleware bắt lỗi
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`)
);
