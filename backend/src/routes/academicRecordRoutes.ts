import { Router } from "express";
import {
  getAcademicRecords,
  createAcademicRecord,
  updateAcademicRecord,
  deleteAcademicRecord,
} from "../controllers/academicRecordController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, getAcademicRecords);
router.post("/", protect, createAcademicRecord);
router.put("/:id", protect, updateAcademicRecord);
router.delete("/:id", protect, deleteAcademicRecord);

export default router;
