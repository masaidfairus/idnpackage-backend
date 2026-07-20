/** Module Rooms — mengelola data kamar asrama */
import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Student } from '../students/entities/student.entity';
import { Package } from '../packages/entities/package.entity';

/** Kelas RoomsModule adalah modul fitur. */
@Module({
  imports: [TypeOrmModule.forFeature([Room, Student, Package])],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
