import { body } from 'express-validator';

export const createCommentValidator = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),

  body('text')
    .notEmpty().withMessage('Text is required')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Text must be between 1 and 1000 characters'),

  body('captcha')
    .notEmpty().withMessage('Captcha is required')
];

// Валідатор для оновлення коментаря (PATCH)
export const updateCommentValidator = [
  body('text')
    .optional({ nullable: true })
    .isLength({ min: 1, max: 1000 })
    .withMessage('Text must be between 1 and 1000 characters'),
];