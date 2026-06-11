import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

type AuthInput = { email: string; password: string };
type SignInData = { userId: number; name: string };

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(input: AuthInput): Promise<SignInData | null> {
    const user = await this.usersService.findUserByEmail(input.email);

    // if () {}

    return null;
  }
}
