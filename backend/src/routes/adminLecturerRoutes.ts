import { Router } from "express";

import {
  getAllLecturers,
  createLecturer,
  updateLecturer,
  deleteLecturer,
} from "../controllers/lecturerController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect, authorizeRoles("HR_ADMIN"));

router.get("/", getAllLecturers);
router.post("/", createLecturer);
router.put("/:id", updateLecturer);
router.delete("/:id", deleteLecturer);

export default router;
