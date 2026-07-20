/**
 * Controller CRUD untuk Room (kamar asrama).
 *
 * Aturan akses:
 * - POST/PATCH/DELETE: Admin atau Teacher
 * - GET: Publik
 *
 * GET /rooms dan GET /rooms/:id me-load relasi students.
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
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Roles } from '../auth/decorator/roles.decorator';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { PassportJwtGuard } from '../auth/guards/passport-jwt.guard';
import { Role } from '../auth/enum/role.enum';

/** Kelas RoomsController mengelola request HTTP masuk. */
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  /**
     * Membuat data baru melalui operasi create.
     * @param createRoomDto Parameter input.
     * @returns Hasil dari operasi create.
     */
    @Roles(Role.ADMIN, Role.TEACHER)
  @UseGuards(RolesGuard)
  @UseGuards(PassportJwtGuard)
  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  /**
     * Mengambil data melalui operasi findAll.
     * @returns Hasil dari operasi findAll.
     */
    @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  /**
     * Mengambil data melalui operasi findOne.
     * @param id Parameter input.
     * @returns Hasil dari operasi findOne.
     */
    @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(+id);
  }

  /**
     * Memperbarui data melalui operasi update.
     * @param id Parameter input.
     * @param updateRoomDto Parameter input.
     * @returns Hasil dari operasi update.
     */
    @Roles(Role.ADMIN, Role.TEACHER)
  @UseGuards(RolesGuard)
  @UseGuards(PassportJwtGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(+id, updateRoomDto);
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
  remove(@Param('id') id: string) {
    return this.roomsService.remove(+id);
  }
}
