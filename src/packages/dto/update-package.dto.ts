import { PartialType } from '@nestjs/mapped-types';
import { CreatePackageDto } from './create-package.dto';
import { IsDateString, IsOptional } from 'class-validator';

export class UpdatePackageDto extends PartialType(CreatePackageDto) {
  @IsOptional()
  @IsDateString()
  pickedUpDate?: string | null;
}
