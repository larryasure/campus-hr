import mongoose, { Document, Schema } from "mongoose";

export type HRRequestType =
  | "LEAVE"
  | "LETTER_OF_INTRODUCTION"
  | "EMPLOYMENT_REFERENCE"
  | "SABBATICAL"
  | "OTHER";

export type HRRequestStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED";

export interface IHRRequest extends Document {
  lecturer: mongoose.Types.ObjectId;
  type: HRRequestType;
  subject: string;
  description: string;
  status: HRRequestStatus;
  adminComment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const hrRequestSchema = new Schema<IHRRequest>(
  {
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
  },
  {
    timestamps: true,
  }
);

const HRRequest = mongoose.model<IHRRequest>(
  "HRRequest",
  hrRequestSchema
);

export default HRRequest;