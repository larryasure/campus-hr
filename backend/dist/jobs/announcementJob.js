import cron from "node-cron";
import Announcement from "../models/Announcement.js";
import User from "../models/User.js";
import { sendAnnouncementEmail } from "../services/emailService.js";
const publishScheduledAnnouncements = async () => {
    try {
        const now = new Date();
        const announcements = await Announcement.find({
            status: "SCHEDULED",
            scheduledAt: {
                $lte: now,
            },
        });
        if (announcements.length === 0) {
            return;
        }
        for (const announcement of announcements) {
            announcement.status = "PUBLISHED";
            announcement.publishedAt = new Date();
            await announcement.save();
            const lecturers = await User.find({
                role: "LECTURER",
                employmentStatus: "ACTIVE",
            }).select("email fullName");
            const emailResults = await Promise.allSettled(lecturers.map((lecturer) => sendAnnouncementEmail(lecturer.email, lecturer.fullName, announcement.title, announcement.content)));
            const emailsSent = emailResults.filter((result) => result.status === "fulfilled").length;
            const emailsFailed = emailResults.filter((result) => result.status === "rejected").length;
            console.log(`Scheduled announcement published: "${announcement.title}"`);
            console.log(`Announcement emails: ${emailsSent} sent, ${emailsFailed} failed.`);
        }
    }
    catch (error) {
        console.error("Scheduled announcement job error:", error);
    }
};
export const startAnnouncementJob = () => {
    cron.schedule("* * * * *", async () => {
        await publishScheduledAnnouncements();
    });
    console.log("Announcement scheduler started.");
};
