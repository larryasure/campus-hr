import mongoose, { Document, Schema } from "mongoose";

export interface IWorkload extends Document {
  lecturer: mongoose.Types.ObjectId;
  courseCode: string;
  courseTitle: string;
  department: string;
  semester: "FIRST" | "SECOND";
  academicSession: string;
  weeklyTeachingHours: number;
  createdAt: Date;
  updatedAt: Date;
}

const workloadSchema = new Schema<IWorkload>(
  {
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
  },
  {
    timestamps: true,
  }
);

const Workload = mongoose.model<IWorkload>(
  "Workload",
  workloadSchema
);

export default Workload;