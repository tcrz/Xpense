import { ErrorRequestHandler } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http";
import { z } from "zod";
import AppError from "../utils/appError";
import { REFRESH_PATH } from "../constants/constants";
import { clearAuthCookies } from "../utils/utils";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(`Path: ${req.path}`, err);

  if(req.path === REFRESH_PATH) {
    clearAuthCookies(res)
  }

  if (err instanceof z.ZodError) {
    return res.status(BAD_REQUEST).json({
      message: "Bad Request",
      errors: err.issues.map((issue) => ({
        field: issue.path.join(","),
        message: issue.message,
      })),
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      errorCode: err.errorCode,
    });
  }
  
  res.status(INTERNAL_SERVER_ERROR).send(err.message);
};
