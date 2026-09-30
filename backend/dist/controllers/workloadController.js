import Workload from "../models/Workload.js";
import { getPagination, getPaginationMeta, } from "../utils/pagination.js";
export const getWorkload = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        const { page, limit, skip } = getPagination(req.query.page, req.query.limit);
        const filter = {
            lecturer: req.user.userId,
        };
        const [workload, total] = await Promise.all([
            Workload.find(filter)
                .sort({ academicSession: -1, semester: 1 })
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
        console.error("Get workload error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching workload",
        });
    }
};
