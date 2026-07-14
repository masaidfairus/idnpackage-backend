/**
 * Passport Local Strategy untuk login via email + password.
 * Menggunakan field 'email' sebagai username (default passport-local adalah 'username').
 */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser({
      email,
      password,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
