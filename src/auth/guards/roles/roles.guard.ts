/**
 * RolesGuard — membaca metadata @Roles() dari handler/class dan mencocokkan
 * dengan role user di request.user.
 *
 * Harus dipasang SETELAH JWT guard agar request.user sudah terisi.
 *
 * Contoh: @UseGuards(RolesGuard) @Roles(Role.ADMIN)
 */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../enum/role.enum';
import { ROLES_KEY } from '../../decorator/roles.decorator';
import { User } from '../../entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const user: User = context.switchToHttp().getRequest().user;

    const hasRequiredRole = requiredRole.some((role) => user.role === role);

    return hasRequiredRole;
  }
}
