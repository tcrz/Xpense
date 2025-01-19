import { UNAUTHORIZED } from "../../constants/http";
import SessionModel from "../../models/session.model";
import UserModel from "../../models/user.model";
import AppError from "../../utils/appError";
import {
  accessTokenOptions,
  refreshTokenOptions,
  signToken,
} from "../../utils/utils";

interface LoginParams {
  email: string;
  password: string;
  userAgent?: string;
}

export const loginService = async (data: LoginParams) => {
  // Check if user exists
  const user = await UserModel.findOne({ email: data.email }).select(
    "+password"
  );

  if (!user || !user.comparePassword(data.password)) {
    throw new AppError(UNAUTHORIZED, "Invalid email or password");
  }

  // Create user session
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
