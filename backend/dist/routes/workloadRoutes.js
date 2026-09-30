import { Router } from "express";
import { getWorkload } from "../controllers/workloadController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = Router();
router.get("/", protect, getWorkload);
export default router;
