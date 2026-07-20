/**
 * Passport JWT Strategy.
 *
 * Ekstrak token dari header Authorization Bearer.
 * Validasi tokenVersion: jika user sudah logout (tokenVersion di-increment),
 * JWT lama akan ditolak meskipun belum expired.
 */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: {
    sub: string;
    name: string;
    roomId: number | null;
    role: string;
    tokenVersion?: number;
  }) {
    if (payload.tokenVersion !== undefined) {
      const user = await this.usersService.findOne(+payload.sub);
      if (!user || user.tokenVersion !== payload.tokenVersion) {
        throw new UnauthorizedException();
      }
      // Gunakan role terbaru dari database
      payload.role = user.role;
    }

    return {
      userId: payload.sub,
      roomId: payload.roomId,
      name: payload.name,
      role: payload.role,
    };
  }
}
