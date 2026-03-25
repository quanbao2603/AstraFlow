import type { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler.js';

type ValidationRule = (req: Request) => { isValid: boolean; message?: string };

/**
 * @function validateRequest
 * @description Lightweight middleware to validate Express HTTP requests before processing controllers.
 * @param rule Validation callback function checking `req` payload.
 * @returns Express RequestHandler middleware.
 */
export const validateRequest = (rule: ValidationRule) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { isValid, message } = rule(req);

    if (!isValid) {
      return next(new AppError(message || 'Validation Failed', 400));
    }

    next();
  };
};
