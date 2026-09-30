import mongoose, { Document, Schema } from "mongoose";

export type AnnouncementStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "PUBLISHED";

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  status: AnnouncementStatus;
  scheduledAt?: Date;
  publishedAt?: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const announcementSchema = new Schema<IAnnouncement>(
  {
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
  },
  {
    timestamps: true,
  },
);

const Announcement = mongoose.model<IAnnouncement>(
  "Announcement",
  announcementSchema,
);

export default Announcement;