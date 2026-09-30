import { Router } from "express";
import { getMyRequests, createRequest, getMyRequestById, } from "../controllers/requestController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = Router();
router.get("/", protect, getMyRequests);
router.post("/", protect, createRequest);
router.get("/:id", protect, getMyRequestById);
export default router;
