import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { sendValidationError } from '../utils/helpers/response.helper';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      next();
      return;
    }

    const errorMessages = errors.array().map(err => {
      const msg = err.msg;
      const field = err.type === 'field' ? `${err.path}: ${msg}` : msg;
      return field;
    });

    sendValidationError(res, 'Validation failed', errorMessages);
  };
};
