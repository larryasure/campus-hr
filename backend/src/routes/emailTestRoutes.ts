import { Router, Response } from "express";

import { protect, AuthRequest } from "../middleware/authMiddleware.js";
import { sendAnnouncementEmail } from "../services/emailService.js";

const router = Router();

router.post("/test", protect, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    await sendAnnouncementEmail(
      "olascolanre@gmail.com",
      "CampusHR Test",
      "Email Service Test",
      "This is a direct test of the CampusHR email service.",
    );

    return res.status(200).json({
      success: true,
      message: "Test email sent successfully",
    });
  } catch (error) {
    console.error("Email test error:", error);

    return res.status(500).json({
      success: false,
      message: "Test email failed",
    });
  }
});

export default router;
