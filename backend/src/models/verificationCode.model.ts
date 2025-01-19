import mongoose from "mongoose";
import { VerificationCodeType } from "../constants/constants";
import { Schema } from "mongoose";

export interface VerificationCodeDocument extends Document {
  userId: mongoose.Types.ObjectId;
  type: VerificationCodeType;
  expiresAt: Date;
  createdAt: Date;
}

const VerificationCodeSchema = new Schema<VerificationCodeType>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  type: {
    type: String,
    required: true,
    enum: Object.values(VerificationCodeType),
  },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
});

const VerificationCodeDocument = mongoose.model<VerificationCodeDocument>(
  "VerificationCode",
  VerificationCodeSchema,
  "verification_codes"
);

export default VerificationCodeDocument;