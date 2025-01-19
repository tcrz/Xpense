import mongoose, { Document, Schema } from "mongoose";
import { thirtyDaysFromNow } from "../utils/utils";

export interface SessionDocument extends Document {
  userId: mongoose.Types.ObjectId;
  userAgent: string;
  createdAt: Date;
  expiresAt: Date;
}

const SessionSchema = new Schema<SessionDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  userAgent: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  expiresAt: { type: Date, default: thirtyDaysFromNow() },
});

const SessionModel = mongoose.model<SessionDocument>("Session", SessionSchema)
export default SessionModel