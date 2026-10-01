import { Router } from "express";

import {
  getAllWorkload,
  createWorkload,
  updateWorkload,
  deleteWorkload,
} from "../controllers/adminWorkloadController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect, authorizeRoles("HR_ADMIN"));

router.get("/", getAllWorkload);
router.post("/", createWorkload);
router.put("/:id", updateWorkload);
router.delete("/:id", deleteWorkload);

export default router;
