import { z } from 'zod';

export const PostSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string().nullish(),
  published: z.boolean().nullish(),
  authorId: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullish(),
});
