import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const imageSchema = z
  .any()
  .transform((fileList: FileList) => Array.from(fileList))
  // .refine((files) => files.length > 0, "At least one image is required")
  .refine(
    (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
    `Each image must be smaller than 5MB`
  )
  .refine(
    (files) => files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
    "Only .jpg, .jpeg, .png and .webp formats are supported."
  );

export const BlogPostSchema = z.object({
  title: z.string().min(5, "title should have at least 5 character"),
  content: z.string().min(10, "content should have at least 10 character"),
  image: imageSchema.optional(),
});

export type Inputs = z.infer<typeof BlogPostSchema>;
