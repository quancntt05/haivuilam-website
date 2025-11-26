import { Response } from 'express';
import { ApiResponse } from '../../types';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): void => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  error?: string
): void => {
  const response: ApiResponse = {
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error : undefined,
  };
  res.status(statusCode).json(response);
};

export const sendValidationError = (res: Response, message: string, errors?: string[]): void => {
  const response: ApiResponse = {
    success: false,
    message,
    error: errors?.join(', '),
  };
  res.status(400).json(response);
};

export const sendUnauthorized = (res: Response, message: string = 'Unauthorized'): void => {
  const response: ApiResponse = {
    success: false,
    message,
  };
  res.status(401).json(response);
};

export const sendForbidden = (res: Response, message: string = 'Forbidden'): void => {
  const response: ApiResponse = {
    success: false,
    message,
  };
  res.status(403).json(response);
};

export const sendNotFound = (res: Response, message: string = 'Resource not found'): void => {
  const response: ApiResponse = {
    success: false,
    message,
  };
  res.status(404).json(response);
};
