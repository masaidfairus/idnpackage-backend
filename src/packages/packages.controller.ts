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

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Roles(Role.ADMIN, Role.TEACHER)
  @UseGuards(RolesGuard)
  @UseGuards(PassportJwtGuard)
  @Post()
  async create(@Body() createPackageDto: CreatePackageDto) {
    return this.packagesService.create(createPackageDto);
  }

  @Get()
  findAll() {
    return this.packagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.packagesService.findOne(+id);
  }

  @Roles(Role.ADMIN, Role.TEACHER)
  @UseGuards(RolesGuard)
  @UseGuards(PassportJwtGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePackageDto: UpdatePackageDto) {
    return this.packagesService.update(+id, updatePackageDto);
  }

  @Roles(Role.ADMIN, Role.TEACHER)
  @UseGuards(RolesGuard)
  @UseGuards(PassportJwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.packagesService.remove(+id);
  }
}
