import { z } from 'zod';

// Регулярка для дозволених HTML тегів
const allowedHtmlRegex = /^(\s*<(\s*(a|code|i|strong)( [^>]+)?\s*>\s*)?[^<>]*<\/\2>\s*)*$/i;

export const createCommentSchema = z.object({
  user_name: z.string()
    .min(1, 'Username is required')
    .regex(/^[a-zA-Z0-9]+$/, 'Username must contain only latin letters and digits'),

  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email format'),

  homepage: z.string()
    .url('Homepage must be a valid URL')
    .optional()
    .or(z.literal('')), // для порожнього значення

  captcha: z.string()
    .min(1, 'Captcha is required'),

  text: z.string()
    .min(1, 'Text is required')
    .max(1000, 'Text must be between 1 and 1000 characters')
    // Перевіряємо лише на базові дозволені теги, якщо треба складніше — можна кастомний sanitizer
    //.regex(allowedHtmlRegex, 'Text contains invalid HTML tags')
});

// Для оновлення коментаря
export const updateCommentSchema = z.object({
  text: z.string()
    .min(1, 'Text is required')
    .max(1000, 'Text must be between 1 and 1000 characters')
    .optional()
});
