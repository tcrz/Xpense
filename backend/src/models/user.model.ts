import mongoose, { Document, Schema } from "mongoose";
import { compareValue, hashValue } from "../utils/utils";

export interface UserDocument extends Document {
  email: string;
  password: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
  },
  {
    toJSON: {
      transform: function (_, ret) {
        delete ret.password; // Exclude password
        return ret;
      },
    },
    toObject: {
      transform: function (_, ret) {
        delete ret.password; // Exclude password
        return ret;
      },
    },
    timestamps: true,
  }
);

// Prevent password from being returned in queries unless explicitly selected
userSchema.path('password').select(false);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hashValue(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = function (password: string) {
  return compareValue(password, this.password);
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);
export default UserModel;
