import { PartialType } from '@nestjs/mapped-types';
import { CreatePackageDto } from './create-package.dto';
import { IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePackageDto extends PartialType(CreatePackageDto) {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  pickedUpDate?: Date | null;
}
