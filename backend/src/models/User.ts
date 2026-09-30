import mongoose, { Document, Schema } from "mongoose";

export type UserRole = "LECTURER" | "HR_ADMIN";

export type EmploymentStatus =
  | "ACTIVE"
  | "ON_LEAVE"
  | "SABBATICAL"
  | "INACTIVE";

export interface IUser extends Document {
  staffId: string;
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  faculty?: string;
  department?: string;
  academicRank?: string;
  dateOfEmployment?: Date;
  employmentStatus: EmploymentStatus;
  profilePhoto?: string;
  role: UserRole;

  passwordResetToken?: string;
  passwordResetExpires?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
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
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;