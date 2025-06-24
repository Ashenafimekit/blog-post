import {
  AbilityBuilder,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Action, AppSubjects } from 'src/common/types/indext';

// type AppSubjects = 'User' | 'Post' | 'all';
export type AppAbility = MongoAbility<[Action, AppSubjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, build, cannot } = new AbilityBuilder(createMongoAbility);

    if (user.role === 'ADMIN') {
      can(Action.Manage, 'all');
    } else {
      cannot(Action.Read, 'Post');
      can(Action.Update, 'Post', { authorId: user.id });
      can(Action.Delete, 'Post', { authorId: user.id });
      can(Action.Read, 'User', { id: user.id });
      can(Action.Update, 'User', { id: user.id });
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
