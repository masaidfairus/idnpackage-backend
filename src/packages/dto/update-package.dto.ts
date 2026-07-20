import { PartialType } from '@nestjs/mapped-types';
import { CreatePackageDto } from './create-package.dto';
import { IsDateString, IsOptional } from 'class-validator';

/** Kelas UpdatePackageDto. */
export class UpdatePackageDto extends PartialType(CreatePackageDto) {
  /** Properti pickedUpDate dengan tipe string | null | undefined. */
    @IsOptional()
  @IsDateString()
  pickedUpDate?: string | null;
}
