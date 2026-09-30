import "dotenv/config";

import express from "express";
import cors from "cors";

import { connectDB } from "./config/db.js";
import { startAnnouncementJob } from "./jobs/announcementJob.js";

import authRoutes from "./routes/authRoutes.js";
import {
  protect,
  AuthRequest,
  authorizeRoles,
} from "./middleware/authMiddleware.js";
import lecturerRoutes from "./routes/lecturerRoutes.js";
import academicRecordRoutes from "./routes/academicRecordRoutes.js";
import workloadRoutes from "./routes/workloadRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import adminRequestRoutes from "./routes/adminRequestRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/lecturers", lecturerRoutes);
app.use("/api/academic-records", academicRecordRoutes);
app.use("/api/workload", workloadRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/admin/requests", adminRequestRoutes);
app.use("/api/announcements", announcementRoutes);

app.get("/api/check", (_req, res) => {
  res.json({
    success: true,
    message: "University HR API is running",
  });
});

app.get("/api/test/protected", protect, (req: AuthRequest, res) => {
  res.json({
    success: true,
    message: "You have access to this protected route",
    user: req.user,
  });
});

app.get(
  "/api/admin/test",
  protect,
  authorizeRoles("HR_ADMIN"),
  (req: AuthRequest, res) => {
    res.json({
      success: true,
      message: "HR Admin access confirmed",
      user: req.user,
    });
  },
);

const startServer = async () => {
  try {
    await connectDB();

    startAnnouncementJob();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

startServer();