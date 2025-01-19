import { UNAUTHORIZED } from "../../constants/http";
import SessionModel from "../../models/session.model";
import {
  accessTokenOptions,
  appAssert,
  refreshTokenOptions,
  RefreshTokenPayload,
  signToken,
  verifyToken,
} from "../../utils/utils";

export const refreshTokenService = async (refreshToken: string) => {
  const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
    secret: refreshTokenOptions.secret,
  });
  appAssert(payload, UNAUTHORIZED, "Invalid refresh token");

  const session = await SessionModel.findById(payload.sessionId);
  const sessionExpired = session && session.expiresAt.getTime() > Date.now()
  appAssert(
    sessionExpired,
    UNAUTHORIZED,
    "session expired"
  );

  const isSessionExpiringSoon = session && (session.expiresAt.getTime() - Date.now()) <= 1000 * 60 * 1;

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
