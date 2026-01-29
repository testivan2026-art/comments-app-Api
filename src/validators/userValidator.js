import { body } from 'express-validator';

export const createUserValidator = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage('Username must contain only latin letters and digits'),

  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),

  body('homepage')
    .optional()
    .isURL().withMessage('Homepage must be a valid URL')
];