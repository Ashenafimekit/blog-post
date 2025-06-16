import { z } from "zod";

export const signupFormSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(4, { message: "Password must be at least 4 characters long" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm Password is required" })
      .min(4, {
        message: "Confirm Password must be at least 4 characters long",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  });

export type signupInputs = z.infer<typeof signupFormSchema>;
