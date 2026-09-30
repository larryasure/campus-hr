import { Router } from "express";
import {
  getAllRequests,
  updateRequest,
} from "../controllers/adminRequestController.js";
import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = Router();

router.get(
  "/",
  protect,
  authorizeRoles("HR_ADMIN"),
  getAllRequests
);

router.patch(
  "/:id",
  protect,
  authorizeRoles("HR_ADMIN"),
  updateRequest
);

export default router;