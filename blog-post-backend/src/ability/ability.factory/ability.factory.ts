import { Injectable } from '@nestjs/common';
import { AbilityBuilder, ExtractSubjectType, PureAbility } from '@casl/ability';
import { User, Post } from '@prisma/client';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type AppSubjects = Subjects<{ User: User; Post: Post }> | 'all';

export type AppAbility = PureAbility<[Action, AppSubjects], PrismaQuery>;

@Injectable()
export class AbilityFactory {
  defineAbility(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createPrismaAbility,
    );

    if (user.role === 'ADMIN') {
      can(Action.Manage, 'all');
    } else {
      can(Action.Read, 'Post');
    }
    return build({
      detectSubjectType: (item) =>
        item.constructor as unknown as ExtractSubjectType<
          Subjects<{ User: User; Post: Post }>
        >,
    });
  }
}
