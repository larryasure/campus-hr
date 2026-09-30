import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
    staffId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    phone: {
        type: String,
        trim: true,
    },
    faculty: {
        type: String,
        trim: true,
    },
    department: {
        type: String,
        trim: true,
    },
    academicRank: {
        type: String,
        trim: true,
    },
    dateOfEmployment: {
        type: Date,
    },
    employmentStatus: {
        type: String,
        enum: ["ACTIVE", "ON_LEAVE", "SABBATICAL", "INACTIVE"],
        default: "ACTIVE",
    },
    profilePhoto: {
        type: String,
        trim: true,
    },
    role: {
        type: String,
        enum: ["LECTURER", "HR_ADMIN"],
        default: "LECTURER",
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetExpires: {
        type: Date,
    },
}, {
    timestamps: true,
});
const User = mongoose.model("User", userSchema);
export default User;
