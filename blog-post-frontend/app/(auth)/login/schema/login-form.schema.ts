import { z } from "zod";

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(4, { message: "Password must be at least 4 characters long" }),
});

export type loginInputs = z.infer<typeof loginFormSchema>;
