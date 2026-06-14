import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

export type AuthInput = { email: string; password: string };
type SignInData = {
  userId: number;
  roomId: number | null;
  name: string;
  role: string;
};

type AuthResult = SignInData & {
  accessToken: string;
};

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
        roomId: user.roomId?.id ?? null,
        name: user.name,
        role: user.role,
      };
    }

    return null;
  }

  async signIn(user: SignInData): Promise<AuthResult> {
    const tokenPayload = {
      sub: user.userId,
      roomId: user.roomId,
      name: user.name,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(tokenPayload);

    return {
      accessToken,
      userId: user.userId,
      roomId: user.roomId,
      name: user.name,
      role: user.role,
    };
  }
}
