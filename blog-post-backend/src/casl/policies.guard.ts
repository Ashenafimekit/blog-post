/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { caslAbilityFactory } from './casl-ability.factory';
import { CHECK_PERMISSIONS_KEY } from './check-permissions.decorator';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: caslAbilityFactory,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const permissions =
      this.reflector.get<[string, any[]]>(
        CHECK_PERMISSIONS_KEY,
        context.getHandler(),
      ) || [];

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log('🚀 ~ PoliciesGuard ~ canActivate ~ user:', user);

    if (!user) {
      return false;
    }
    const ability = this.caslAbilityFactory.createForUser(user);

    for (const [action, subject] of permissions) {
      if (!ability.can(action, subject)) {
        throw new ForbiddenException('Access denied');
      }
    }
    return true;
  }
}
