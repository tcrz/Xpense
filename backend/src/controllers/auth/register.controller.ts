import { CREATED, OK } from "../../constants/http";
import { createAccount } from "../../services/auth/register.service";
import { handleAsyncController } from "../../utils/handleAsyncController";
import { setAuthCookies } from "../../utils/utils";
import { registerSchema } from "./schemas";

export const registerHandler = handleAsyncController(async (req, res, next) => {
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  // Create user
  const { user, refreshToken, accessToken } = await createAccount({
    email: request.email,
    password: request.password,
    userAgent: request.userAgent,
  });

  // set refresh token in cookie
  const updatedResponse = await setAuthCookies({
    res,
    accessToken,
    refreshToken,
  });

  // return user
  updatedResponse.status(CREATED).json(user);
});

