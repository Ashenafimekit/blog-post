import { Injectable } from '@nestjs/common';
import { Post } from 'src/post/entity/post.entity';
import { User } from 'src/user/entity/user.entity';
import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  PureAbility,
} from '@casl/ability';

type Subjects = InferSubjects<typeof Post | typeof User> | 'all';
type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';

export type AppAbility = PureAbility<[Actions, Subjects]>;

@Injectable()
export class caslAbilityFactory {
  createForUser(user: User): AppAbility {
    const { can, cannot, build } = new AbilityBuilder<
      PureAbility<[Actions, Subjects]>
    >(PureAbility as AbilityClass<AppAbility>);

    if (user.role === 'ADMIN') {
      can('manage', 'all');
    } else {
      can('read', Post);
      can('create', Post);
      can('update', Post, { authorId: user.id });
      can('delete', Post, { authorId: user.id });
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
