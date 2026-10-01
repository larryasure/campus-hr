import Workload from "../models/Workload.js";
import User from "../models/User.js";
import { getPagination, getPaginationMeta, } from "../utils/pagination.js";
/**
 * GET ALL WORKLOAD
 * HR Admin only
 */
export const getAllWorkload = async (req, res) => {
    try {
        const { page, limit, skip, } = getPagination(req.query.page, req.query.limit);
        const search = req.query.search?.trim() || "";
        const department = req.query.department?.trim() || "";
        const semester = req.query.semester?.trim() || "";
        const academicSession = req.query.academicSession?.trim() || "";
        const lecturerId = req.query.lecturerId?.trim() || "";
        const filter = {};
        if (department) {
            filter.department = department;
        }
        if (semester) {
            filter.semester = semester;
        }
        if (academicSession) {
            filter.academicSession = academicSession;
        }
        if (lecturerId) {
            filter.lecturer = lecturerId;
        }
        if (search) {
            const lecturers = await User.find({
                role: "LECTURER",
                $or: [
                    {
                        fullName: {
                            $regex: search,
                            $options: "i",
                        },
                    },
                    {
                        staffId: {
                            $regex: search,
                            $options: "i",
                        },
                    },
                    {
                        email: {
                            $regex: search,
                            $options: "i",
                        },
                    },
                ],
            }).select("_id");
            const lecturerIds = lecturers.map((lecturer) => lecturer._id);
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
                {
                    lecturer: {
                        $in: lecturerIds,
                    },
                },
            ];
        }
        const [workload, total] = await Promise.all([
            Workload.find(filter)
                .populate("lecturer", "staffId fullName email faculty department academicRank")
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
    }
    catch (error) {
        console.error("Get admin workload error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching workload",
        });
    }
};
/**
 * CREATE WORKLOAD
 * HR Admin only
 */
export const createWorkload = async (req, res) => {
    try {
        const { lecturer, courseCode, courseTitle, department, semester, academicSession, weeklyTeachingHours, } = req.body;
        if (!lecturer ||
            !courseCode ||
            !courseTitle ||
            !department ||
            !semester ||
            !academicSession ||
            weeklyTeachingHours === undefined) {
            return res.status(400).json({
                success: false,
                message: "Lecturer, course code, course title, department, semester, academic session and weekly teaching hours are required",
            });
        }
        const lecturerExists = await User.findOne({
            _id: lecturer,
            role: "LECTURER",
        });
        if (!lecturerExists) {
            return res.status(404).json({
                success: false,
                message: "Lecturer not found",
            });
        }
        if (!["FIRST", "SECOND"].includes(semester)) {
            return res.status(400).json({
                success: false,
                message: "Semester must be FIRST or SECOND",
            });
        }
        if (typeof weeklyTeachingHours !== "number" ||
            weeklyTeachingHours < 0) {
            return res.status(400).json({
                success: false,
                message: "Weekly teaching hours must be a valid non-negative number",
            });
        }
        const workload = await Workload.create({
            lecturer,
            courseCode,
            courseTitle,
            department,
            semester,
            academicSession,
            weeklyTeachingHours,
        });
        const populatedWorkload = await workload.populate("lecturer", "staffId fullName email faculty department academicRank");
        return res.status(201).json({
            success: true,
            message: "Workload created successfully",
            data: populatedWorkload,
        });
    }
    catch (error) {
        console.error("Create workload error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while creating workload",
        });
    }
};
/**
 * UPDATE WORKLOAD
 * HR Admin only
 */
export const updateWorkload = async (req, res) => {
    try {
        const { id } = req.params;
        const { lecturer, courseCode, courseTitle, department, semester, academicSession, weeklyTeachingHours, } = req.body;
        if (semester && !["FIRST", "SECOND"].includes(semester)) {
            return res.status(400).json({
                success: false,
                message: "Semester must be FIRST or SECOND",
            });
        }
        if (weeklyTeachingHours !== undefined &&
            (typeof weeklyTeachingHours !== "number" ||
                weeklyTeachingHours < 0)) {
            return res.status(400).json({
                success: false,
                message: "Weekly teaching hours must be a valid non-negative number",
            });
        }
        if (lecturer) {
            const lecturerExists = await User.findOne({
                _id: lecturer,
                role: "LECTURER",
            });
            if (!lecturerExists) {
                return res.status(404).json({
                    success: false,
                    message: "Lecturer not found",
                });
            }
        }
        const workload = await Workload.findByIdAndUpdate(id, {
            ...(lecturer !== undefined && {
                lecturer,
            }),
            ...(courseCode !== undefined && {
                courseCode,
            }),
            ...(courseTitle !== undefined && {
                courseTitle,
            }),
            ...(department !== undefined && {
                department,
            }),
            ...(semester !== undefined && {
                semester,
            }),
            ...(academicSession !== undefined && {
                academicSession,
            }),
            ...(weeklyTeachingHours !== undefined && {
                weeklyTeachingHours,
            }),
        }, {
            new: true,
            runValidators: true,
        }).populate("lecturer", "staffId fullName email faculty department academicRank");
        if (!workload) {
            return res.status(404).json({
                success: false,
                message: "Workload record not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Workload updated successfully",
            data: workload,
        });
    }
    catch (error) {
        console.error("Update workload error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while updating workload",
        });
    }
};
/**
 * DELETE WORKLOAD
 * HR Admin only
 */
export const deleteWorkload = async (req, res) => {
    try {
        const { id } = req.params;
        const workload = await Workload.findByIdAndDelete(id);
        if (!workload) {
            return res.status(404).json({
                success: false,
                message: "Workload record not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Workload deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete workload error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while deleting workload",
        });
    }
};
