import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthInput, AuthResult, SignInData } from './enum/auth.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async authenticate(input: AuthInput): Promise<AuthResult> {
    const user = await this.validateUser(input);

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.signIn(user);
  }

  async validateUser(input: AuthInput): Promise<SignInData | null> {
    const user = await this.usersService.findUserByEmail(input.email);

    if (user) {
      const isMatch = await bcrypt.compare(input.password, user.password);

      if (!isMatch) {
        throw new UnauthorizedException();
      }

      return {
        userId: user.id,
        name: user.name,
        role: user.role,
        tokenVersion: user.tokenVersion,
      };
    }

    return null;
  }

  async signIn(user: SignInData): Promise<AuthResult> {
    const tokenPayload = {
      sub: user.userId,
      name: user.name,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };

    const accessToken = await this.jwtService.signAsync(tokenPayload);

    return {
      accessToken,
      userId: user.userId,
      name: user.name,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };
  }

  async logout(userId: number) {
    await this.usersService.incrementTokenVersion(userId);
    return { message: 'Logged out successfully' };
  }
}
