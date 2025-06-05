import { AbilityBuilder, AbilityClass, PureAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

type AppSubjects = 'User' | 'Post' | 'all';
export type AppAbility = PureAbility<[Action, AppSubjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder<AppAbility>(
      PureAbility as AbilityClass<AppAbility>,
    );

    if (user.role === 'ADMIN') {
      can(Action.Manage, 'all');
    } else {
      can(Action.Read, 'Post', { authorId: user.id });
    }

    return build({
      detectSubjectType: (item) => {
        if ('email' in item) return 'User';
        if ('title' in item && 'authorId' in item) return 'Post';
        return 'all';
      },
    });
  }
}
