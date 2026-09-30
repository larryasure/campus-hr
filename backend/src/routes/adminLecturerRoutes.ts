import { Router } from "express";

import { getAllLecturers } from "../controllers/lecturerController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = Router();

router.get(
  "/",
  protect,
  authorizeRoles("HR_ADMIN"),
  getAllLecturers,
);

export default router;