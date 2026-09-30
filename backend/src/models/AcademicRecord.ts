import mongoose, { Document, Schema } from "mongoose";

export interface IAcademicRecord extends Document {
  lecturer: mongoose.Types.ObjectId;
  degree: string;
  institution: string;
  year: number;
  academicRank?: string;
  promotionHistory?: string[];
  researchInterests?: string[];
  publications?: string[];
  certifications?: string[];
  affiliations?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const academicRecordSchema = new Schema<IAcademicRecord>(
  {
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
  },
  {
    timestamps: true,
  },
);

const AcademicRecord = mongoose.model<IAcademicRecord>(
  "AcademicRecord",
  academicRecordSchema,
);

export default AcademicRecord;
