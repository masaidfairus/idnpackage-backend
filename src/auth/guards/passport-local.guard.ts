/** Passport guard untuk Local Strategy — digunakan di /auth-v2/login */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class PassportLocalGuard extends AuthGuard('local') {}
