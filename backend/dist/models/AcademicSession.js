import mongoose, { Schema } from "mongoose";
const academicSessionSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    isCurrent: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
const AcademicSession = mongoose.model("AcademicSession", academicSessionSchema);
export default AcademicSession;
