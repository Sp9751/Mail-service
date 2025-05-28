import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface ITemplate extends Document {
  templateName: string;
  templateDescription: string;
  templateUrl: string;
  status: "saved" | "draft";
  userId: Types.ObjectId;
}

const templateSchema: Schema<ITemplate> = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    templateName: { type: String, required: true },
    templateDescription: { type: String },
    templateUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ["saved", "draft"],
      default: "draft",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Make sure this matches your User model name
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const templateModel: Model<ITemplate> = mongoose.model<ITemplate>(
  "Template",
  templateSchema
);

export default templateModel;
