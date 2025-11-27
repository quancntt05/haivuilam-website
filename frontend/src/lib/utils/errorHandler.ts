import { message } from 'antd';

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Array<{ field: string; message: string }>;
}

export const handleApiError = (error: unknown, defaultMessage = 'An error occurred'): void => {
  if (error instanceof Error) {
    const apiError = error as ApiError;
    
    if (apiError.errors && apiError.errors.length > 0) {
      // Validation errors
      apiError.errors.forEach(err => {
        message.error(`${err.field}: ${err.message}`);
      });
    } else {
      // General error
      message.error(apiError.message || defaultMessage);
    }
  } else {
    message.error(defaultMessage);
  }
};

export const getErrorMessage = (error: unknown, defaultMessage = 'An error occurred'): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
};

