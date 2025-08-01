import { Response } from "express";
import ErrorHanldler from "../utils/ErrorHandler";

export const ErrorMiddleware = (err: any, res: Response) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHanldler(message, 400);
  }

  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHanldler(message, 400);
  }

  if (err.name === "JsonWebTokenError") {
    const message = `Json web token is invalid. Try again`;
    err = new ErrorHanldler(message, 400);
  }

  if (err.name === "TokenExpiredError") {
    const message = `Json web token is expired. Try again`;
    err = new ErrorHanldler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
