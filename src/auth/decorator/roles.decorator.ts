/**
 * Decorator @Roles() untuk menandai role yang diizinkan mengakses endpoint.
 * Dipasangkan dengan RolesGuard yang membaca metadata ini.
 *
 * Contoh: @Roles(Role.ADMIN, Role.TEACHER)
 */
import { SetMetadata } from '@nestjs/common';
import { Role } from '../enum/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: [Role, ...Role[]]) =>
  SetMetadata(ROLES_KEY, roles);
