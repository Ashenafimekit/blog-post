import { SetMetadata } from '@nestjs/common';
import { Action } from './ability.factory/ability.factory';
import { AppSubjects } from './ability.factory/ability.factory';

export const CHECK_PERMISSIONS_KEY = 'check_permissions';
export const CheckPermissios = (action: Action, subject: AppSubjects) => {
  return SetMetadata(CHECK_PERMISSIONS_KEY, { action, subject });
};
