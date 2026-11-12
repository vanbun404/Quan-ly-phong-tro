import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import roomRoutes from "./routes/room.routes.js";
import contract from "./routes/contract.routes.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/rooms", roomRoutes);
app.use("/contracts", contract);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Room-service running on port http://localhost:${PORT}`);
});
