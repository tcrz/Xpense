import {
  VerificationCodeType,
} from "../../constants/constants";
import { CONFLICT } from "../../constants/http";
import SessionModel from "../../models/session.model";
import UserModel from "../../models/user.model";
import VerificationCodeDocument from "../../models/verificationCode.model";
import AppError from "../../utils/appError";
import {
  accessTokenOptions,
  oneWeekFromNow,
  refreshTokenOptions,
  signToken,
} from "../../utils/utils";
import jwt from "jsonwebtoken";

interface CreateAccountParams {
  email: string;
  password: string;
  userAgent?: string;
}

export const createAccount = async (data: CreateAccountParams) => {
  // Check if the user already exists
  const userExists = await UserModel.exists({ email: data.email });

  // If the user already exists, throw an error
  if (userExists) {
    throw new AppError(CONFLICT, "User already exists");
  }
  
  // Create user
  const user = await UserModel.create({
    email: data.email,
    password: data.password,
  });

  // Create verification code
  const verificationCode = await VerificationCodeDocument.create({
    userId: user._id,
    type: VerificationCodeType.EmailVerification,
    expiresAt: oneWeekFromNow(),
  });

  // send verification code

  // create user session
  const session = await SessionModel.create({
    userId: user._id,
    userAgent: data.userAgent,
  });

  // Create refresh token
  const refreshToken = signToken(
    {
      sessionId: session._id as string,
    },
    refreshTokenOptions
  );

  // Create access token
  const accessToken = signToken(
    {
      userId: user._id,
      sessionId: session._id,
    },
    accessTokenOptions
  );

  return {
    user,
    refreshToken,
    accessToken,
  };
};
