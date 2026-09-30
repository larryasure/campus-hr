import HRRequest from "../models/HRRequest.js";
import { getPagination, getPaginationMeta, } from "../utils/pagination.js";
export const getAllRequests = async (req, res) => {
    try {
        const { page, limit, skip } = getPagination(req.query.page, req.query.limit);
        const filter = {};
        if (req.query.status) {
            filter.status = req.query.status;
        }
        if (req.query.type) {
            filter.type = req.query.type;
        }
        const [requests, total] = await Promise.all([
            HRRequest.find(filter)
                .populate("lecturer", "staffId fullName email faculty department academicRank")
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
    }
    catch (error) {
        console.error("Get all requests error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching HR requests",
        });
    }
};
export const updateRequest = async (req, res) => {
    try {
        const { status, adminComment } = req.body;
        const validStatuses = [
            "PENDING",
            "UNDER_REVIEW",
            "APPROVED",
            "REJECTED",
        ];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid request status",
            });
        }
        const request = await HRRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({
                success: false,
                message: "HR request not found",
            });
        }
        if (status !== undefined) {
            request.status = status;
        }
        if (adminComment !== undefined) {
            request.adminComment = adminComment;
        }
        await request.save();
        const updatedRequest = await HRRequest.findById(request._id).populate("lecturer", "staffId fullName email faculty department academicRank");
        return res.status(200).json({
            success: true,
            message: "HR request updated successfully",
            data: updatedRequest,
        });
    }
    catch (error) {
        console.error("Update request error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while updating HR request",
        });
    }
};
