/**
 * Module Users.
 * Mengexport UsersService agar bisa dipakai oleh AuthModule dan module lain.
 */
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Room } from '../rooms/entities/room.entity';

/** Kelas UsersModule adalah modul fitur. */
@Module({
  imports: [TypeOrmModule.forFeature([User, Room])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
