/**
 * Module Packages.
 * Mengelola data paket/parcel untuk siswa.
 * Meregister entity Package, Student, Room, dan User untuk repository injection.
 */
import { Module } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Package } from './entities/package.entity';
import { Student } from '../students/entities/student.entity';
import { Room } from '../rooms/entities/room.entity';
import { User } from '../auth/entities/user.entity';

/** Kelas PackagesModule adalah modul fitur. */
@Module({
  imports: [TypeOrmModule.forFeature([Package, Student, Room, User])],
  controllers: [PackagesController],
  providers: [PackagesService],
})
export class PackagesModule {}
