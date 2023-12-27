import { SetMetadata } from '@nestjs/common';

export const ROLE_META_TAG = 'decorators/roles';

export type RoleDecoration = { roles: string[]; customerIdPath: string };

export const RolesDecorator = (args: RoleDecoration) =>
  SetMetadata<string, RoleDecoration>(ROLE_META_TAG, args);
