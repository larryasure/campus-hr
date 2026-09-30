import mongoose, { Schema } from "mongoose";
const hrRequestSchema = new Schema({
    lecturer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    type: {
        type: String,
        enum: [
            "LEAVE",
            "LETTER_OF_INTRODUCTION",
            "EMPLOYMENT_REFERENCE",
            "SABBATICAL",
            "OTHER",
        ],
        required: true,
    },
    subject: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: [
            "PENDING",
            "UNDER_REVIEW",
            "APPROVED",
            "REJECTED",
        ],
        default: "PENDING",
        index: true,
    },
    adminComment: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});
const HRRequest = mongoose.model("HRRequest", hrRequestSchema);
export default HRRequest;
