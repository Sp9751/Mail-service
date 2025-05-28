export interface IFailed {
  email: string;
  reason: string;
  timestamp: Date;
}

export interface IRecipient {
  email: string;
  status: "pending" | "sent" | "failed" | "opened" | "clicked";
  updatedAt?: Date;
  reason?: string;
}

export interface IOpen {
  count: number;
  userIp: string[];
  logs?: {
    email: string;
    timestamp: Date;
  }[];
}

export interface IClick {
  count: number;
  userIp: string[];
  logs?: {
    email: string;
    url: string;
    timestamp: Date;
  }[];
}

export interface IMailTrack {
  campaignId: string;
  userId: string;
  totalMails: number;
  recipients: IRecipient[];
  open: IOpen;
  click: IClick;
  failed: IFailed[];
  success: IFailed[];
  createdAt?: Date;
  updatedAt?: Date;
}

// models/MailTrack.ts

import { Schema, model } from "mongoose";

const OpenSchema: Schema = new Schema({
  count: { type: Number, default: 0 },
  userIp: { type: [String], default: [] },
  logs: [
    {
      email: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const ClickSchema: Schema = new Schema({
  count: { type: Number, default: 0 },
  userIp: { type: [String], default: [] },
  logs: [
    {
      email: String,
      url: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const FailedSchema: Schema = new Schema({
  email: { type: String, required: true },
  reason: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const RecipientSchema: Schema = new Schema({
  email: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "sent", "failed", "opened", "clicked"],
    default: "pending",
  },
  updatedAt: { type: Date },
  reason: { type: String },
});

const MailTrackSchema: Schema<IMailTrack> = new Schema(
  {
    campaignId: { type: String, required: true },
    userId: { type: String, required: true },
    totalMails: { type: Number, required: true },
    recipients: { type: [RecipientSchema], default: [] },
    open: { type: OpenSchema, default: () => ({}) },
    click: { type: ClickSchema, default: () => ({}) },
    failed: { type: [FailedSchema], default: [] },
    success: { type: [FailedSchema], default: [] }, // same shape as failed
  },
  { timestamps: true }
);

const MailTrackModel = model<IMailTrack>("MailTrack", MailTrackSchema);

export default MailTrackModel;
