import { z } from 'zod';

// Регулярка для дозволених HTML тегів (якщо треба — можна додати кастомну перевірку)
const allowedHtmlRegex = /^(\s*<(\s*(a|code|i|strong)( [^>]+)?\s*>\s*)?[^<>]*<\/\2>\s*)*$/i;

export const createCommentSchema = z.object({
  username: z.string()
    .min(1, 'Username is required')
    .regex(/^[a-zA-Z0-9]+$/, 'Username must contain only latin letters and digits'),

  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email format'),

  homepage: z.string()
    .url('Homepage must be a valid URL')
    .optional()
    .or(z.literal('')), // допускаємо порожнє значення

  captcha: z.string()
    .min(1, 'Captcha is required'),

  text: z.string()
    .min(1, 'Text is required')
    .max(1000, 'Text must be between 1 and 1000 characters')
    //.regex(allowedHtmlRegex, 'Text contains invalid HTML tags') // можна розкоментувати для строгих тегів
});

// Для оновлення коментаря
export const updateCommentSchema = z.object({
  text: z.string()
    .min(1, 'Text is required')
    .max(1000, 'Text must be between 1 і 1000 characters')
    .optional()
});