/**
 * Controller CRUD untuk Package (paket/parcel).
 *
 * Aturan akses:
 * - POST:   Admin atau Operator
 * - GET:    Publik (tanpa token)
 * - PATCH:  Admin atau Teacher
 * - DELETE: Admin saja
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
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { Role } from '../auth/enum/role.enum';
import { Roles } from '../auth/decorator/roles.decorator';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { PassportJwtGuard } from '../auth/guards/passport-jwt.guard';

/** Kelas PackagesController mengelola request HTTP masuk. */
@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  /**
     * Membuat data baru melalui operasi create.
     * @param createPackageDto Parameter input.
     * @returns Hasil dari operasi create.
     */
    @Roles(Role.ADMIN, Role.OPERATOR)
  @UseGuards(RolesGuard)
  @UseGuards(PassportJwtGuard)
  @Post()
  async create(@Body() createPackageDto: CreatePackageDto) {
    return this.packagesService.create(createPackageDto);
  }

  /**
     * Mengambil data melalui operasi findAll.
     * @returns Hasil dari operasi findAll.
     */
    @Get()
  findAll() {
    return this.packagesService.findAll();
  }

  /**
     * Mengambil data melalui operasi findOne.
     * @param id Parameter input.
     * @returns Hasil dari operasi findOne.
     */
    @Get(':id')
  findOne(@Param('id') id: string) {
    return this.packagesService.findOne(+id);
  }

  /**
     * Memperbarui data melalui operasi update.
     * @param id Parameter input.
     * @param updatePackageDto Parameter input.
     * @returns Hasil dari operasi update.
     */
    @Roles(Role.ADMIN, Role.TEACHER, Role.OPERATOR)
  @UseGuards(RolesGuard)
  @UseGuards(PassportJwtGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePackageDto: UpdatePackageDto) {
    return this.packagesService.update(+id, updatePackageDto);
  }

  /**
     * Memperbarui data melalui operasi toggleTaken.
     * @param id Parameter input.
     * @returns Hasil dari operasi toggleTaken.
     */
    @Roles(Role.ADMIN, Role.TEACHER)
  @UseGuards(RolesGuard)
  @UseGuards(PassportJwtGuard)
  @Patch(':id/toggle-taken')
  toggleTaken(@Param('id') id: string) {
    return this.packagesService.toggleTaken(+id);
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
  remove(@Param('id') id: string) {
    return this.packagesService.remove(+id);
  }
}
