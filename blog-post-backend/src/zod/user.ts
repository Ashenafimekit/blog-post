import * as z from 'zod';
// import { Role } from './enums';

export const UserSchema = z.object({
  id: z.string().nullable(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  password: z.string().nullable(),
  // profile: z.string().optional(),
  // role: z.nativeEnum(Role),
});

export type userDto = z.infer<typeof UserSchema>;
