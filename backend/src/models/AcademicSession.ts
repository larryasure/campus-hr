import mongoose, { Document, Schema } from "mongoose";

export interface IAcademicSession extends Document {
  name: string;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
}

const academicSessionSchema = new Schema<IAcademicSession>(
  {
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
  },
  {
    timestamps: true,
  }
);

const AcademicSession = mongoose.model<IAcademicSession>(
  "AcademicSession",
  academicSessionSchema
);

export default AcademicSession;