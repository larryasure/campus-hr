import { Response } from "express";
import AcademicSession from "../models/AcademicSession.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

export const getAcademicSessions = async (req: AuthRequest, res: Response) => {
  try {
    const sessions = await AcademicSession.find()
      .sort({ startDate: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    console.error("Get academic sessions error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching academic sessions",
    });
  }
};

export const getCurrentAcademicSession = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const session = await AcademicSession.findOne({
      isCurrent: true,
    }).lean();

    return res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error("Get current academic session error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching current academic session",
    });
  }
};

export const createAcademicSession = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { name, startDate, endDate, isCurrent } = req.body;

    if (!name || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Name, start date and end date are required",
      });
    }

    const existingSession = await AcademicSession.findOne({ name });

    if (existingSession) {
      return res.status(409).json({
        success: false,
        message: "Academic session already exists",
      });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    if (isCurrent === true) {
      await AcademicSession.updateMany(
        { isCurrent: true },
        { $set: { isCurrent: false } },
      );
    }

    const session = await AcademicSession.create({
      name,
      startDate,
      endDate,
      isCurrent: isCurrent === true,
    });

    return res.status(201).json({
      success: true,
      message: "Academic session created successfully",
      data: session,
    });
  } catch (error) {
    console.error("Create academic session error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating academic session",
    });
  }
};

export const setCurrentAcademicSession = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const session = await AcademicSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Academic session not found",
      });
    }

    await AcademicSession.updateMany(
      { isCurrent: true },
      { $set: { isCurrent: false } },
    );

    session.isCurrent = true;

    await session.save();

    return res.status(200).json({
      success: true,
      message: "Current academic session updated successfully",
      data: session,
    });
  } catch (error) {
    console.error("Set current academic session error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating academic session",
    });
  }
};
