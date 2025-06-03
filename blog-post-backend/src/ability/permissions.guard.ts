// permissions.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory } from './abilityFactory/ability.factory';
import { CHECK_PERMISSIONS_KEY } from './check-permissions.decorator';
import { AppSubjects, Action } from './ability.factory';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Retrieve permissions metadata
    const permission = this.reflector.get<{
      action: Action;
      subject: AppSubjects;
    }>(CHECK_PERMISSIONS_KEY, context.getHandler());

    if (!permission) {
      // No permissions required for the route
      return true;
    }

    // Extract user from request
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    // Build ability instance for the user
    const ability = this.abilityFactory.defineAbility(user);

    // Check permission
    if (ability.can(permission.action, permission.subject)) {
      return true;
    }

    throw new ForbiddenException(
      'You do not have permission to access this resource',
    );
  }
}
