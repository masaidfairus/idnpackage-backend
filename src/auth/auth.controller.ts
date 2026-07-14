/**
 * Auth controller versi 1 (custom AuthGuard).
 *
 * Endpoints:
 * - POST /auth/login  — publik, mengembalikan JWT
 * - GET  /auth/me     — perlu token, mengembalikan info user dari token
 * - POST /auth/logout — perlu token, invalidasi session via tokenVersion
 */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import type { AuthInput } from './enum/auth.enum';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() input: AuthInput) {
    return this.authService.authenticate(input);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  getUserInfo(@Request() request) {
    return request.user;
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  logout(@Request() request) {
    return this.authService.logout(request.user.userId);
  }
}
