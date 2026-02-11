import { z } from 'zod';


export const createCommentSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  text: z.string().min(1),

  parent_id: z.coerce.number().optional(),

  homepage: z.string().optional().or(z.literal('')),

  captcha: z.string().min(1),
});

export const updateCommentSchema = z.object({
  text: z.string()
    .min(1, 'Text is required')
    .max(1000, 'Text must be between 1 and 1000 characters')
    .optional()
});