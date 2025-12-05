import { z } from "zod";

export const registerSchema = z
  .object({
    // username: z
    //   .string()
    //   .min(3, "Username must be at least 3 characters")
    //   .max(32)
    //   .regex(
    //     /^[a-zA-Z0-9_]+$/,
    //     "Username can only contain letters, numbers, and underscores"
    //   ),

    email: z.email(),
    password: z.string().min(6).max(255),
    confirmPassword: z.string().min(6).max(255),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterDTO = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  identifier: z.string().min(3, "Provide email or username"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginDTO = z.infer<typeof loginSchema>;
