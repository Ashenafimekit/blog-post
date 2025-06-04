import { SetMetadata } from '@nestjs/common';

export const CHECK_PERMISSIONS_KEY = 'check_permissions';

export const checkPermissions = (...permissions: [string, any][]) =>
  SetMetadata(CHECK_PERMISSIONS_KEY, permissions);
