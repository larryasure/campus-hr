import mongoose, { Schema } from "mongoose";
const workloadSchema = new Schema({
    lecturer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    courseCode: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
    },
    courseTitle: {
        type: String,
        required: true,
        trim: true,
    },
    department: {
        type: String,
        required: true,
        trim: true,
    },
    semester: {
        type: String,
        enum: ["FIRST", "SECOND"],
        required: true,
    },
    academicSession: {
        type: String,
        required: true,
        trim: true,
    },
    weeklyTeachingHours: {
        type: Number,
        required: true,
        min: 0,
    },
}, {
    timestamps: true,
});
const Workload = mongoose.model("Workload", workloadSchema);
export default Workload;
