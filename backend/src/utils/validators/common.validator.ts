import { body, param, query } from 'express-validator';

export const validateUUID = (field: string = 'id') => {
  return param(field).isUUID().withMessage(`${field} must be a valid UUID`);
};

export const validatePagination = () => {
  return [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer')
      .toInt(),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
      .toInt(),
  ];
};

export const validatePhotoId = () => {
  return body('photoId').isUUID().withMessage('Photo ID must be a valid UUID');
};

export const validateUserId = (field: string = 'userId') => {
  return param(field).isUUID().withMessage(`${field} must be a valid UUID`);
};
