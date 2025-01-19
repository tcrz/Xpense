import bcrypt from "bcrypt";
import { CookieOptions, Response } from "express";
import jwt, { JwtPayload, VerifyOptions } from "jsonwebtoken";
import { SignOptions } from "jsonwebtoken";
import { AppErrorCode, JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/constants";
import { SessionDocument } from "../models/session.model";
import { UserDocument } from "../models/user.model";
import { HttpStatusCode } from "../constants/http";
import AppError from "./appError";
import assert from "node:assert";

export const hashValue = async (value: string, saltRounds: number) => {
  return bcrypt.hash(value, saltRounds);
};

export const compareValue = async (value: string, hashedValue: string) => {
  return bcrypt.compare(value, hashedValue).catch(() => false);
};

export const oneWeekFromNow = () => {
  return new Date(Date.now() + 7 * 60 * 60 * 24 * 1000);
};

export const thirtyDaysFromNow = () => {
  return new Date(Date.now() + 30 * 60 * 60 * 24 * 1000);
};

export const fifteenMinutesFromNow = () => {
  return new Date(Date.now() + 15 * 60 * 1000);
};

export const ACCESS_TOKEN_EXPIRATION_TIME = {
  expirationTimestamp: fifteenMinutesFromNow(),
  jwtExpirationTime: "15m"
}

export const REFRESH_TOKEN_EXPIRATION_TIME = {
  expirationTimestamp: thirtyDaysFromNow(),
  jwtExpirationTime: "30d"
}

const cookieOptions: CookieOptions = {
  sameSite: "strict",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

interface AuthCookiesParams {
  res: Response;
  accessToken: string;
  refreshToken: string;
}

export const setAuthCookies = ({
  res,
  accessToken,
  refreshToken,
}: AuthCookiesParams) => {
  return res
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      expires: ACCESS_TOKEN_EXPIRATION_TIME.expirationTimestamp,
    })
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      expires: REFRESH_TOKEN_EXPIRATION_TIME.expirationTimestamp,
      path: "/auth/refresh",
    });
};

export interface RefreshTokenPayload extends JwtPayload {
  sessionId: SessionDocument["_id"];
};

export interface AccessTokenPayload extends JwtPayload {
  userId: UserDocument["_id"];
  sessionId: SessionDocument["_id"];
};

type SignOptionsAndSecret = SignOptions & {
  secret: string;
};

export const accessTokenOptions: SignOptionsAndSecret = {
  expiresIn: ACCESS_TOKEN_EXPIRATION_TIME.jwtExpirationTime,
  secret: JWT_SECRET,
  audience: ["user"],
};

export const refreshTokenOptions: SignOptionsAndSecret = {
  expiresIn: REFRESH_TOKEN_EXPIRATION_TIME.jwtExpirationTime,
  secret: JWT_REFRESH_SECRET,
  audience: ["user"],
};

export const signToken = (
  payload: RefreshTokenPayload | AccessTokenPayload,
  options: SignOptionsAndSecret
) => {
  const { secret, ...signOptions } = options;
  return jwt.sign(payload, secret, signOptions);
};

export const verifyToken = <TPayload extends object = AccessTokenPayload>(
  token: string,
  options?: VerifyOptions & { secret: string }
) => {
  const { secret = JWT_SECRET, ...verifyOptions } = options || {};
  try {
    const payload = jwt.verify(token, secret, {
      audience: ["user"],
      ...verifyOptions,
    }) as TPayload;
    return { payload };
  } catch (error) {
    let err = error;

    if (error instanceof Error) {
      err = error.message;
    }

    return {
      error: err,
    };
  }
};

export const clearAuthCookies = (res: Response) => {
  return res.clearCookie("accessToken").clearCookie("refreshToken", {
    path: "/auth/refresh",
  });
}

/**
 * Asserts a condition and throws an AppError if the condition is falsy.
*/

type AppAssert = (
  condition: any,
  httpStatusCode: HttpStatusCode,
  message: string,
  appErrorCode?: AppErrorCode
) => asserts condition;

export const appAssert: AppAssert = (
  condition,
  httpStatusCode,
  message,
  appErrorCode
) => assert(condition, new AppError(httpStatusCode, message, appErrorCode));