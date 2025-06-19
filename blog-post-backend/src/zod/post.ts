import { z } from 'zod';

export const PostSchema = z.object({
  title: z.string().min(5, 'Title must have at least 5 characters'),
  content: z.string().min(10, 'Content must have at least 10 characters'),
  authorId: z.string().nonempty('Author ID is required to post or update'),
});

export type CreatePostDto = z.infer<typeof PostSchema>;

export const PostUpdateSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must have at least 5 characters')
    .nullable()
    .optional(),
  content: z
    .string()
    .min(10, 'Content must have at least 10 characters')
    .nullable()
    .optional(),
  authorId: z.string().nonempty('Author ID is required to post or update'),
});

export type UpdatePostDto = z.infer<typeof PostUpdateSchema>;
