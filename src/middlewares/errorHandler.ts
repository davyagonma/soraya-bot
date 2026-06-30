import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError, ValidationError } from '../utils/errors';
import { errorLogger } from '../utils/logger';

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
};

export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof ValidationError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  if (err instanceof ZodError) {
    const errors: Record<string, string[]> = {};
    err.errors.forEach((e) => {
      const key = e.path.join('.');
      if (!errors[key]) errors[key] = [];
      errors[key].push(e.message);
    });
    res.status(400).json({ success: false, message: 'Validation failed', errors });
    return;
  }

  if (err instanceof AppError) {
    if (!err.isOperational) errorLogger(err);
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }

  errorLogger(err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};
