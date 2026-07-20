/**
 * Controller CRUD untuk Student (siswa).
 *
 * Aturan akses:
 * - POST/PATCH/DELETE: Admin atau Teacher
 * - GET: Publik
 *
 * Setiap student terhubung ke satu Room.
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
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { CreateBulkStudentDto } from './dto/create-bulk-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { PassportJwtGuard } from '../auth/guards/passport-jwt.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../auth/enum/role.enum';

/** Kelas StudentsController mengelola request HTTP masuk. */
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  /**
     * Membuat data baru melalui operasi create.
     * @param createStudentDto Parameter input.
     * @returns Hasil dari operasi create.
     */
    @Roles(Role.ADMIN, Role.TEACHER)
  @UseGuards(RolesGuard)
  @UseGuards(PassportJwtGuard)
  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  /** Bulk sync: upsert by NIS, fallback dedup by nama+kamar */
  @Roles(Role.ADMIN, Role.TEACHER)
  @UseGuards(RolesGuard)
  @UseGuards(PassportJwtGuard)
  @Post('bulk')
  async bulkSync(@Body() createBulkDto: CreateBulkStudentDto) {
    return this.studentsService.bulkSync(createBulkDto);
  }

  /** Hard reset: hapus semua santri aktif (tahun ajaran baru) */
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(PassportJwtGuard)
  @Delete('reset-all')
  async resetAll() {
    return this.studentsService.resetAllActive();
  }

  /**
     * Mengambil data melalui operasi findAll.
     * @returns Hasil dari operasi findAll.
     */
    @Get()
  async findAll() {
    return this.studentsService.findAll();
  }

  /**
     * Mengambil data melalui operasi findArchived.
     * @returns Hasil dari operasi findArchived.
     */
    @Get('archived')
  async findArchived() {
    return this.studentsService.findAllArchived();
  }

  /**
     * Mengambil data melalui operasi findOne.
     * @param id Parameter input.
     * @returns Hasil dari operasi findOne.
     */
    @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.studentsService.findOne(+id);
  }

  /**
     * Memperbarui data melalui operasi update.
     * @param id Parameter input.
     * @param updateStudentDto Parameter input.
     * @returns Hasil dari operasi update.
     */
    @Roles(Role.ADMIN, Role.TEACHER)
  @UseGuards(RolesGuard)
  @UseGuards(PassportJwtGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentsService.update(+id, updateStudentDto);
  }

  /** Arsipkan santri yang lulus (soft delete) */
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(PassportJwtGuard)
  @Patch(':id/archive')
  async archive(@Param('id') id: string) {
    return this.studentsService.archiveStudent(+id);
  }

  /**
     * Menghapus data melalui operasi remove.
     * @param id Parameter input.
     * @returns Hasil dari operasi remove.
     */
    @Roles(Role.ADMIN, Role.TEACHER)
  @UseGuards(RolesGuard)
  @UseGuards(PassportJwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.studentsService.remove(+id);
  }
}
