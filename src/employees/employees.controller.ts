/**
 * Controller CRUD untuk Employee (karyawan/pegawai).
 *
 * Aturan akses:
 * - POST/PATCH/DELETE: Admin
 * - GET: Publik
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../auth/enum/role.enum';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { PassportJwtGuard } from '../auth/guards/passport-jwt.guard';

/** Kelas EmployeesController mengelola request HTTP masuk. */
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  /**
   * Membuat data baru melalui operasi create.
   * @param createEmployeeDto Parameter input.
   * @returns Hasil dari operasi create.
   */
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(PassportJwtGuard)
  @Post()
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  /**
   * Mengambil data melalui operasi findAll.
   * @returns Hasil dari operasi findAll.
   */
  @Get()
  async findAll() {
    return this.employeesService.findAll();
  }

  /**
   * Mengambil data melalui operasi findOne.
   * @param id Parameter input.
   * @returns Hasil dari operasi findOne.
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.employeesService.findOne(+id);
  }

  /**
   * Memperbarui data melalui operasi update.
   * @param id Parameter input.
   * @param updateEmployeeDto Parameter input.
   * @returns Hasil dari operasi update.
   */
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(PassportJwtGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(+id, updateEmployeeDto);
  }

  /**
   * Menghapus data melalui operasi remove.
   * @param id Parameter input.
   * @returns Hasil dari operasi remove.
   */
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(PassportJwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.employeesService.remove(+id);
  }
}
