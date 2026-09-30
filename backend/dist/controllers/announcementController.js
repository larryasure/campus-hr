import Announcement from "../models/Announcement.js";
import User from "../models/User.js";
import { sendAnnouncementEmail } from "../services/emailService.js";
export const createAnnouncement = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        const { title, content } = req.body;
        if (!title?.trim() || !content?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required",
            });
        }
        const announcement = await Announcement.create({
            title: title.trim(),
            content: content.trim(),
            status: "DRAFT",
            createdBy: req.user.userId,
        });
        return res.status(201).json({
            success: true,
            message: "Announcement saved as draft",
            data: announcement,
        });
    }
    catch (error) {
        console.error("Create announcement error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while creating announcement",
        });
    }
};
export const getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find({
            status: "PUBLISHED",
        })
            .sort({ publishedAt: -1 })
            .populate("createdBy", "fullName");
        return res.status(200).json({
            success: true,
            data: announcements,
        });
    }
    catch (error) {
        console.error("Get announcements error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching announcements",
        });
    }
};
export const getAdminAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find()
            .sort({ createdAt: -1 })
            .populate("createdBy", "fullName");
        return res.status(200).json({
            success: true,
            data: announcements,
        });
    }
    catch (error) {
        console.error("Get admin announcements error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching announcements",
        });
    }
};
export const updateAnnouncement = async (req, res) => {
    try {
        const { title, content } = req.body;
        const announcement = await Announcement.findById(req.params.id);
        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: "Announcement not found",
            });
        }
        if (announcement.status === "PUBLISHED") {
            return res.status(400).json({
                success: false,
                message: "Published announcements cannot be edited",
            });
        }
        if (title !== undefined) {
            if (!title.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Title cannot be empty",
                });
            }
            announcement.title = title.trim();
        }
        if (content !== undefined) {
            if (!content.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Content cannot be empty",
                });
            }
            announcement.content = content.trim();
        }
        await announcement.save();
        return res.status(200).json({
            success: true,
            message: "Announcement updated successfully",
            data: announcement,
        });
    }
    catch (error) {
        console.error("Update announcement error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while updating announcement",
        });
    }
};
export const scheduleAnnouncement = async (req, res) => {
    try {
        const { scheduledAt } = req.body;
        if (!scheduledAt) {
            return res.status(400).json({
                success: false,
                message: "Scheduled date and time are required",
            });
        }
        const scheduledDate = new Date(scheduledAt);
        if (Number.isNaN(scheduledDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid scheduled date and time",
            });
        }
        if (scheduledDate <= new Date()) {
            return res.status(400).json({
                success: false,
                message: "Scheduled time must be in the future",
            });
        }
        const announcement = await Announcement.findById(req.params.id);
        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: "Announcement not found",
            });
        }
        if (announcement.status !== "DRAFT") {
            return res.status(400).json({
                success: false,
                message: "Only draft announcements can be scheduled",
            });
        }
        announcement.status = "SCHEDULED";
        announcement.scheduledAt = scheduledDate;
        await announcement.save();
        return res.status(200).json({
            success: true,
            message: "Announcement scheduled successfully",
            data: announcement,
        });
    }
    catch (error) {
        console.error("Schedule announcement error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while scheduling announcement",
        });
    }
};
export const cancelScheduledAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: "Announcement not found",
            });
        }
        if (announcement.status !== "SCHEDULED") {
            return res.status(400).json({
                success: false,
                message: "Only scheduled announcements can be cancelled",
            });
        }
        announcement.status = "DRAFT";
        announcement.scheduledAt = undefined;
        await announcement.save();
        return res.status(200).json({
            success: true,
            message: "Scheduled announcement cancelled",
            data: announcement,
        });
    }
    catch (error) {
        console.error("Cancel scheduled announcement error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while cancelling scheduled announcement",
        });
    }
};
export const publishAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: "Announcement not found",
            });
        }
        if (announcement.status === "PUBLISHED") {
            return res.status(400).json({
                success: false,
                message: "Announcement is already published",
            });
        }
        announcement.status = "PUBLISHED";
        announcement.publishedAt = new Date();
        announcement.scheduledAt = undefined;
        await announcement.save();
        const lecturers = await User.find({
            role: "LECTURER",
            employmentStatus: "ACTIVE",
        }).select("email fullName");
        const emailResults = await Promise.allSettled(lecturers.map((lecturer) => sendAnnouncementEmail(lecturer.email, lecturer.fullName, announcement.title, announcement.content)));
        const emailsSent = emailResults.filter((result) => result.status === "fulfilled").length;
        const emailsFailed = emailResults.filter((result) => result.status === "rejected").length;
        if (emailsFailed > 0) {
            console.error(`Announcement published, but ${emailsFailed} email(s) failed.`);
        }
        return res.status(200).json({
            success: true,
            message: "Announcement published successfully",
            data: announcement,
            notifications: {
                totalLecturers: lecturers.length,
                emailsSent,
                emailsFailed,
            },
        });
    }
    catch (error) {
        console.error("Publish announcement error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while publishing announcement",
        });
    }
};
export const deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findByIdAndDelete(req.params.id);
        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: "Announcement not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Announcement deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete announcement error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while deleting announcement",
        });
    }
};
