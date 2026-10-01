import { Response } from "express";

import Workload from "../models/Workload.js";
import { AuthRequest } from "../middleware/authMiddleware.js";
import { getPagination, getPaginationMeta } from "../utils/pagination.js";

export const getWorkload = async (req: AuthRequest, res: Response) => {
  try {
    const { page, limit, skip } = getPagination(
      req.query.page as string,
      req.query.limit as string,
    );

    const search = (req.query.search as string)?.trim() || "";

    const department = (req.query.department as string)?.trim() || "";

    const semester = (req.query.semester as string)?.trim() || "";

    const academicSession = (req.query.academicSession as string)?.trim() || "";

    const filter: Record<string, any> = {};

    if (department) {
      filter.department = department;
    }

    if (semester) {
      filter.semester = semester;
    }

    if (academicSession) {
      filter.academicSession = academicSession;
    }

    if (search) {
      filter.$or = [
        {
          courseCode: {
            $regex: search,
            $options: "i",
          },
        },
        {
          courseTitle: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const [workload, total] = await Promise.all([
      Workload.find(filter)
        .populate(
          "lecturer",
          "staffId fullName email faculty department academicRank",
        )
        .sort({
          academicSession: -1,
          semester: 1,
          courseCode: 1,
        })
        .skip(skip)
        .limit(limit),

      Workload.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: workload,
      pagination: getPaginationMeta(page, limit, total),
    });
  } catch (error) {
    console.error("Get admin workload error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching workload",
    });
  }
};
