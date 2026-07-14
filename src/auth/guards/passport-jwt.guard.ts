/** Passport guard untuk JWT Strategy — dipakai di semua endpoint yang perlu auth */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class PassportJwtGuard extends AuthGuard('jwt') {}
