import { PartialType } from '@nestjs/mapped-types';
import { CreatePackageDto } from './create-package.dto';
import { IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePackageDto extends PartialType(CreatePackageDto) {
  @Type(() => Date)
  @IsDate()
  pickedUpDate?: Date | null;
}
