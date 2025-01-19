import { sign } from "jsonwebtoken";
import { JWT_REFRESH_SECRET } from "../../constants/constants";
import { UNAUTHORIZED } from "../../constants/http";
import SessionModel from "../../models/session.model";
import UserModel from "../../models/user.model";
import {
  accessTokenOptions,
  appAssert,
  refreshTokenOptions,
  RefreshTokenPayload,
  signToken,
  thirtyDaysFromNow,
  verifyToken,
} from "../../utils/utils";

export const refreshTokenService = async (refreshToken: string) => {
  const { payload, error } = verifyToken<RefreshTokenPayload>(refreshToken, {
    secret: refreshTokenOptions.secret,
  });
  appAssert(payload, UNAUTHORIZED, "Invalid refresh token");
  // console.log(new Date((payload.exp as unknown as Date).getTime()).toLocaleString())

  const session = await SessionModel.findById(payload.sessionId);
  const sessionExpired = session && session.expiresAt.getTime() > Date.now()
  appAssert(
    sessionExpired,
    UNAUTHORIZED,
    "session expired"
  );
  console.log(session.expiresAt)
  const isSessionExpiringSoon = session && (session.expiresAt.getTime() - Date.now()) <= 1000 * 60 * 1;
  console.log({isSessionExpiringSoon})
  let newRefreshToken = refreshToken;
  if (isSessionExpiringSoon) {
    session.expiresAt = new Date(Date.now() + 1 * 60 * 1000);
    await session.save();
    newRefreshToken = signToken({
      sessionId: session._id,
    }, refreshTokenOptions)
  }

  const newAccessToken = signToken({
    userId: session.userId,
    sessionId: session._id,
  }, accessTokenOptions)

  return {
    newRefreshToken,
    newAccessToken
  }
};
