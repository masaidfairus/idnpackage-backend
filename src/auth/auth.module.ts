/**
 * Module autentikasi & otorisasi.
 * Menyediakan dua versi auth:
 * - v1 (custom AuthGuard): POST /auth/login, GET /auth/me, POST /auth/logout
 * - v2 (Passport): POST /auth-v2/login, GET /auth-v2/me, POST /auth-v2/logout
 *
 * Menggunakan JWT (HS256, expire 1 hari) + tokenVersion untuk logout invalidation.
 * JwtModule dikonfigurasi global agar bisa dipakai oleh AuthGuard di module lain.
 */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { PassportAuthController } from './passport-auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

/** Kelas AuthModule adalah modul fitur. */
@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController, PassportAuthController],
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    PassportModule,
  ],
})
export class AuthModule {}
