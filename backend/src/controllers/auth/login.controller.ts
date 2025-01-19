import { z } from "zod";
import { handleAsyncController } from "../../utils/handleAsyncController";
import { loginSchema } from "./schemas";
import { loginService } from "../../services/auth/login.service";
import { setAuthCookies } from "../../utils/utils";
import { OK } from "../../constants/http";

export const loginHandler = handleAsyncController(async (req, res) => {
    const request = loginSchema.parse({
      ...req.body,
      userAgent: req.headers["user-agent"],
    })
  
    const { user, refreshToken, accessToken } = await loginService({
      ...request,
      userAgent: req.headers["user-agent"],
    });
  
    // set refresh and access tokens in cookies
    const updatedResponse = await setAuthCookies({
      res,
      accessToken,
      refreshToken,
    });
  
    updatedResponse.status(OK).json(user);
  });