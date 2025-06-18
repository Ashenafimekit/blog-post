import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const imageSchema = z
  .custom<File>((file) => file instanceof File, {
    message: "No file selected",
  })
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: "Image must be smaller than 5MB",
  })
  .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
    message: "Only .jpg, .jpeg, .png, and .webp formats are supported.",
  });

export const ProfileEditSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  image: imageSchema.optional(),
});

export type EditInput = z.infer<typeof ProfileEditSchema>;
