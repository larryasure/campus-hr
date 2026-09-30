import mongoose, { Schema } from "mongoose";
const academicRecordSchema = new Schema({
    lecturer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    degree: {
        type: String,
        required: true,
        trim: true,
    },
    institution: {
        type: String,
        required: true,
        trim: true,
    },
    year: {
        type: Number,
        required: true,
        min: 1900,
        max: new Date().getFullYear(),
    },
    academicRank: {
        type: String,
        trim: true,
    },
    promotionHistory: {
        type: [String],
        default: [],
    },
    researchInterests: {
        type: [String],
        default: [],
    },
    publications: {
        type: [String],
        default: [],
    },
    certifications: {
        type: [String],
        default: [],
    },
    affiliations: {
        type: [String],
        default: [],
    },
}, {
    timestamps: true,
});
const AcademicRecord = mongoose.model("AcademicRecord", academicRecordSchema);
export default AcademicRecord;
