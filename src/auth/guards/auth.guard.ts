/**
 * Custom AuthGuard (v1) — verifikasi JWT manual tanpa Passport.
 *
 * - Ekstrak token dari header Authorization
 * - Verifikasi dengan JwtService
 * - Cek tokenVersion untuk deteksi logout
 * - Set request.user dengan data dari token
 */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    const token = authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const tokenPayload = await this.jwtService.verifyAsync(token);

      if (tokenPayload.tokenVersion !== undefined) {
        const user = await this.usersService.findOne(tokenPayload.sub);
        if (!user || user.tokenVersion !== tokenPayload.tokenVersion) {
          throw new UnauthorizedException();
        }
      }

      request.user = {
        userId: tokenPayload.sub,
        roomId: tokenPayload.roomId,
        name: tokenPayload.name,
        role: tokenPayload.role,
      };
      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
