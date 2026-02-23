import { z } from "zod";

export const createUserSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .regex(/^[a-zA-Z0-9]+$/, "Only latin letters and digits"),
  email: z.string().email("Invalid email"),
  homepage: z.string().url("Invalid URL").optional().or(z.literal("")),
});