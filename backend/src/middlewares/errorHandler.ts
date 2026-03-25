import type { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/response.js';

/**
 * @class AppError
 * @extends Error
 * @description Custom error type wrapper to trigger managed HTTP status codes.
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Flag for known mapped errors vs unexpected engine crashes

    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * @function errorHandler
 * @description Centralized Express global error handling middleware Router.
 * Standardizes outgoing JSON to remove sensitive Stack traces in support.
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';

  // Log critical errors on developer console
  if (statusCode === 500 || !err.isOperational) {
    console.error(`[Error Handler] Unidentified Error:`, err);
  }

  ApiResponse.error(res, message, statusCode, err);
};
