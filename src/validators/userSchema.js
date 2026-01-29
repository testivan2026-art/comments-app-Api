import { z } from 'zod';

export const createUserSchema = z.object({
  username: z.string()
    .min(1, 'Username is required')
    .regex(/^[a-zA-Z0-9]+$/, 'Username must contain only latin letters and digits'),

  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email format'),

  homepage: z.string()
    .url('Homepage must be a valid URL')
    .optional()
    .or(z.literal('')) // для порожнього значення
});
