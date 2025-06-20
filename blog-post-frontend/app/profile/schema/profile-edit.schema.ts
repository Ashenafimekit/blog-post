import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const imageSchema = z
  .instanceof(File)
  .optional() // 👈 Explicitly optional
  .refine(
    (file) => !file || file.size <= MAX_FILE_SIZE, // 👈 Skip if undefined
    {
      message: "Image must be smaller than 5MB",
    }
  )
  .refine(
    (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), // 👈 Skip if undefined
    {
      message: "Only .jpg, .jpeg, .png, and .webp formats are supported.",
    }
  );
export const ProfileEditSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  avatar: imageSchema.optional(),
});

export type EditInput = z.infer<typeof ProfileEditSchema>;
