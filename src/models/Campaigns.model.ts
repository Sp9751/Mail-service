import mongoose, { Schema, Model, Types } from "mongoose";

interface IAttachment {
  filename: string;
  url: string;
  mimeType?: string;
}

interface ICampaign {
  _id: string;
  name: string;
  to: Types.ObjectId[];
  subject: string;
  TemplateId: Types.ObjectId;
  userId: Types.ObjectId;
  attachments?: IAttachment[];
  status: "draft" | "sent" | "scheduled";
}

const CampaignSchema: Schema<ICampaign> = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    to: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Audience",
        required: true,
      },
    ],
    subject: { type: String, required: true },
    TemplateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Template",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attachments: [
      {
        filename: { type: String, required: true },
        url: { type: String, required: true },
        mimeType: { type: String },
      },
    ],
    status: {
      type: String,
      enum: ["draft", "sent", "scheduled"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

const CampaignModel: Model<ICampaign> = mongoose.model<ICampaign>(
  "Campaign",
  CampaignSchema
);

export default CampaignModel;
