import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { sendError } from '../utils/helpers/response.helper';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  if (err instanceof PrismaClientKnownRequestError) {
    handlePrismaError(err, res);
    return;
  }

  if (err.name === 'ValidationError' || err.message.includes('validation')) {
    sendError(res, err.message || 'Validation error', 400);
    return;
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    sendError(res, 'Invalid or expired token', 401);
    return;
  }

  if (err.message.includes('multer') || err.message.includes('file')) {
    sendError(res, err.message || 'File upload error', 400);
    return;
  }

  console.error('Unhandled error:', {
    message: err.message,
    stack: err.stack,
    name: err.name,
  });

  sendError(res, 'Internal server error', 500, err.stack);
};

const handlePrismaError = (err: PrismaClientKnownRequestError, res: Response): void => {
  switch (err.code) {
    case 'P2002':
      sendError(res, 'Unique constraint violation', 409);
      break;
    case 'P2025':
      sendError(res, 'Record not found', 404);
      break;
    case 'P2003':
      sendError(res, 'Foreign key constraint violation', 400);
      break;
    default:
      console.error('Prisma error:', err);
      sendError(res, 'Database error', 500);
  }
};
