import { z } from "zod";

export const loginSchema = z.object({
  email: z.string()
    .trim()
    .nonempty("Email is required")
    .email("Invalid email format"),
  password: z.string().nonempty("Password is required"),
});

export const registerSchema = z
  .object({
    name: z.string()
      .trim()
      .min(2, "Name must be at least 2 characters long")
      .max(20, "Name cannot exceed 20 characters"),

    email: z.string()
      .trim()
      .nonempty("Email is required")
      .email("Invalid email format"),

    password: z.string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),

    confirmPassword: z.string().nonempty("Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  avatar: z.string().optional(),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
export type RegisterSchemaType = z.infer<typeof registerSchema>;