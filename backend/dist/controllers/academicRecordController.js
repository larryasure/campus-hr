import AcademicRecord from "../models/AcademicRecord.js";
import { getPagination, getPaginationMeta } from "../utils/pagination.js";
export const getAcademicRecords = async (req, res) => {
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
        const [records, total] = await Promise.all([
            AcademicRecord.find(filter)
                .sort({ year: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit),
            AcademicRecord.countDocuments(filter),
        ]);
        return res.status(200).json({
            success: true,
            data: records,
            pagination: getPaginationMeta(page, limit, total),
        });
    }
    catch (error) {
        console.error("Get academic records error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching academic records",
        });
    }
};
export const createAcademicRecord = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        const { degree, institution, year, academicRank, promotionHistory, researchInterests, publications, certifications, affiliations, } = req.body;
        if (!degree || !institution || !year) {
            return res.status(400).json({
                success: false,
                message: "Degree, institution and year are required",
            });
        }
        const record = await AcademicRecord.create({
            lecturer: req.user.userId,
            degree,
            institution,
            year,
            academicRank,
            promotionHistory,
            researchInterests,
            publications,
            certifications,
            affiliations,
        });
        return res.status(201).json({
            success: true,
            message: "Academic record created successfully",
            data: record,
        });
    }
    catch (error) {
        console.error("Create academic record error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while creating academic record",
        });
    }
};
export const updateAcademicRecord = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        const record = await AcademicRecord.findOne({
            _id: req.params.id,
            lecturer: req.user.userId,
        });
        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Academic record not found",
            });
        }
        const { degree, institution, year, academicRank, promotionHistory, researchInterests, publications, certifications, affiliations, } = req.body;
        if (degree !== undefined)
            record.degree = degree;
        if (institution !== undefined)
            record.institution = institution;
        if (year !== undefined)
            record.year = year;
        if (academicRank !== undefined)
            record.academicRank = academicRank;
        if (promotionHistory !== undefined) {
            record.promotionHistory = promotionHistory;
        }
        if (researchInterests !== undefined) {
            record.researchInterests = researchInterests;
        }
        if (publications !== undefined) {
            record.publications = publications;
        }
        if (certifications !== undefined) {
            record.certifications = certifications;
        }
        if (affiliations !== undefined) {
            record.affiliations = affiliations;
        }
        await record.save();
        return res.status(200).json({
            success: true,
            message: "Academic record updated successfully",
            data: record,
        });
    }
    catch (error) {
        console.error("Update academic record error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while updating academic record",
        });
    }
};
export const deleteAcademicRecord = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        const record = await AcademicRecord.findOneAndDelete({
            _id: req.params.id,
            lecturer: req.user.userId,
        });
        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Academic record not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Academic record deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete academic record error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while deleting academic record",
        });
    }
};
