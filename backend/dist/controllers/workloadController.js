import Workload from "../models/Workload.js";
import { getPagination, getPaginationMeta } from "../utils/pagination.js";
export const getWorkload = async (req, res) => {
    try {
        const { page, limit, skip } = getPagination(req.query.page, req.query.limit);
        const search = req.query.search?.trim() || "";
        const department = req.query.department?.trim() || "";
        const semester = req.query.semester?.trim() || "";
        const academicSession = req.query.academicSession?.trim() || "";
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
