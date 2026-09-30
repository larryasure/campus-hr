import mongoose, { Schema } from "mongoose";
const announcementSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ["DRAFT", "SCHEDULED", "PUBLISHED"],
        default: "DRAFT",
    },
    scheduledAt: {
        type: Date,
    },
    publishedAt: {
        type: Date,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});
const Announcement = mongoose.model("Announcement", announcementSchema);
export default Announcement;
