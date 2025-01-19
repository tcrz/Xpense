import { JWT_SECRET } from "../../constants/constants";
import { OK, UNAUTHORIZED } from "../../constants/http";
import SessionModel from "../../models/session.model";
import { handleAsyncController } from "../../utils/handleAsyncController";
import { appAssert, clearAuthCookies, verifyToken } from "../../utils/utils";

export const logoutHandler = handleAsyncController(async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const { payload } = verifyToken(accessToken, {
    secret: JWT_SECRET,
  });

  appAssert(payload, UNAUTHORIZED, "Failed to log out");

  await SessionModel.findByIdAndDelete(payload.sessionId);

  clearAuthCookies(res);

  res.status(OK).json({ message: "Successfully logged out" });
});
