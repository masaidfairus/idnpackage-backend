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

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Roles(Role.ADMIN, Role.TEACHER)
  @UseGuards(RolesGuard)
  @UseGuards(PassportJwtGuard)
  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(+id);
  }

  @Roles(Role.ADMIN, Role.TEACHER)
  @UseGuards(RolesGuard)
  @UseGuards(PassportJwtGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(+id, updateRoomDto);
  }

  @Roles(Role.ADMIN, Role.TEACHER)
  @UseGuards(RolesGuard)
  @UseGuards(PassportJwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(+id);
  }
}
