import { Router } from "express";

import {
  getAllRequests,
  updateRequest,
  deleteRequest,
} from "../controllers/adminRequestController.js";

import {
  protect,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = Router();

router.use(
  protect,
  authorizeRoles("HR_ADMIN"),
);

router.get(
  "/",
  getAllRequests,
);

router.patch(
  "/:id",
  updateRequest,
);

router.delete(
  "/:id",
  deleteRequest,
);

export default router;