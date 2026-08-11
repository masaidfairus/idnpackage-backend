/**
 * Module CRUD untuk Employee (karyawan/pegawai).
 *
 * Aturan akses:
 * - POST/PATCH/DELETE: Admin
 * - GET: Publik
 */
import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { Employee } from './entities/employee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

/** Kelas EmployeesModule adalah modul fitur. */
@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
