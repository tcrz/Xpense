import { OK, UNAUTHORIZED } from "../../constants/http";
import { refreshTokenService } from "../../services/auth/refresh-token.service";
import { handleAsyncController } from "../../utils/handleAsyncController";
import { appAssert, setAuthCookies } from "../../utils/utils";

export const refreshTokenHandler = handleAsyncController(
  async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    appAssert(refreshToken, UNAUTHORIZED, "Missing refresh token");
    const payload = await refreshTokenService(refreshToken);
    const updatedResponse = await setAuthCookies({
      res,
      accessToken: payload.newAccessToken,
      refreshToken: payload.newRefreshToken,
    });
    updatedResponse.status(OK).json({ message: "Successfully refreshed token" });
  }
);
