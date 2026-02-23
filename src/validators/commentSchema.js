import { z } from "zod";

export const createCommentSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email"),
  text: z
    .string()
    .min(1, "Text is required")
    .max(1000, "Max 1000 characters"),
  parent_id: z.coerce.number().optional(),
  homepage: z.string().optional().or(z.literal("")),
  captcha: z.string().min(1, "Captcha is required"),
  captchaId: z.string().uuid("Invalid captcha ID"),
});

export const updateCommentSchema = z.object({
  text: z
    .string()
    .min(1, "Text is required")
    .max(1000, "Max 1000 characters")
    .optional(),
});