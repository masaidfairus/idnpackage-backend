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
import { UpdateStudentDto } from './dto/update-student.dto';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { PassportJwtGuard } from '../auth/guards/passport-jwt.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../auth/enum/role.enum';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Roles(Role.ADMIN, Role.TEACHER)
  @UseGuards(RolesGuard)
  @UseGuards(PassportJwtGuard)
  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  async findAll() {
    return this.studentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.studentsService.findOne(+id);
  }

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

  @Roles(Role.ADMIN, Role.TEACHER)
  @UseGuards(RolesGuard)
  @UseGuards(PassportJwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.studentsService.remove(+id);
  }
}
