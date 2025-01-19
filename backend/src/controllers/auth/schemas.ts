import { z } from "zod";

const loginInfoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20),
});

export const registerSchema = loginInfoSchema
  .extend({
    confirmPassword: loginInfoSchema.shape.password,
    userAgent: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = loginInfoSchema.extend({
  userAgent: z.string().optional(),
});
