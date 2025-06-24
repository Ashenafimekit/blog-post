import { PureAbility } from '@casl/ability';
import { PrismaQuery, Subjects } from '@casl/prisma';
import { Post, User } from '@prisma/client';

export type AppSubjects = Subjects<{ User: User; Post: Post }> | 'all';

export type AppAbility = PureAbility<[string, AppSubjects], PrismaQuery>;

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}
