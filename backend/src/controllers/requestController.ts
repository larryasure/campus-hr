import { Request, Response, NextFunction } from "express";
import HRRequest from "../models/HRRequest.js";
import { AuthRequest } from "../middleware/authMiddleware.js";
import {
  getPagination,
  getPaginationMeta,
} from "../utils/pagination.js";

export const getMyRequests = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { page, limit, skip } = getPagination(
      req.query.page as string,
      req.query.limit as string
    );

    const filter = {
      lecturer: req.user.userId,
    };

    const [requests, total] = await Promise.all([
      HRRequest.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      HRRequest.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: requests,
      pagination: getPaginationMeta(page, limit, total),
    });
  } catch (error) {
    console.error("Get requests error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching requests",
    });
  }
};

export const createRequest = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { type, subject, description } = req.body;

    if (!type || !subject || !description) {
      return res.status(400).json({
        success: false,
        message: "Request type, subject and description are required",
      });
    }

    const validTypes = [
      "LEAVE",
      "LETTER_OF_INTRODUCTION",
      "EMPLOYMENT_REFERENCE",
      "SABBATICAL",
      "OTHER",
    ];

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request type",
      });
    }

    const request = await HRRequest.create({
      lecturer: req.user.userId,
      type,
      subject,
      description,
      status: "PENDING",
    });

    return res.status(201).json({
      success: true,
      message: "HR request submitted successfully",
      data: request,
    });
  } catch (error) {
    console.error("Create request error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating request",
    });
  }
};

export const getMyRequestById = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const request = await HRRequest.findOne({
      _id: req.params.id,
      lecturer: req.user.userId,
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "HR request not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error("Get request error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching request",
    });
  }
};