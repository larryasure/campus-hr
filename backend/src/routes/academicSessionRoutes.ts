import { Router } from "express";

import {
  getAcademicSessions,
  getCurrentAcademicSession,
  createAcademicSession,
  setCurrentAcademicSession,
} from "../controllers/academicSessionController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/current", protect, getCurrentAcademicSession);

router.get("/", protect, authorizeRoles("HR_ADMIN"), getAcademicSessions);

router.post("/", protect, authorizeRoles("HR_ADMIN"), createAcademicSession);

router.patch(
  "/:id/current",
  protect,
  authorizeRoles("HR_ADMIN"),
  setCurrentAcademicSession,
);

export default router;
