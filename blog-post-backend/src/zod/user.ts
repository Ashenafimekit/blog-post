import * as z from 'zod/';
import { Role } from './enums';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().nullish(),
  email: z.string().nullish(),
  password: z.string().nullish(),
  role: z.nativeEnum(Role),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullish(),
});
