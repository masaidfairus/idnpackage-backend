/**
 * Controller CRUD untuk Users.
 *
 * Hanya admin yang bisa create/update/delete user.
 * GET /users dan GET /users/:id bersifat publik (tanpa auth).
 *
 * Semua password di-hash dengan bcrypt sebelum disimpan.
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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../auth/enum/role.enum';
import { PassportJwtGuard } from '../auth/guards/passport-jwt.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(PassportJwtGuard)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(PassportJwtGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(PassportJwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
