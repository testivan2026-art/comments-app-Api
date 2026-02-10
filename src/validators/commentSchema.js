import { z } from 'zod';

export const createCommentSchema = z.object({
  username: z.string()
    .min(1, 'Username is required')
    .regex(/^[a-zA-Z0-9]+$/, 'Username must contain only latin letters and digits'),

  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email format'),

  homepage: z.string().optional().or(z.literal('')),

  text: z.string()
    .min(1, 'Text is required')
    .max(1000, 'Text must be between 1 and 1000 characters'),

  captcha: z.string().min(1, 'Captcha is required')
});

export const updateCommentSchema = z.object({
  text: z.string()
    .min(1, 'Text is required')
    .max(1000, 'Text must be between 1 and 1000 characters')
    .optional()
});