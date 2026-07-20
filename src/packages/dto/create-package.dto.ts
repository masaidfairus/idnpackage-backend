import { IsEnum, IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { PackageLocation } from '../enum/package.enum';

export class CreatePackageDto {
  @IsNumber()
  @IsNotEmpty()
  studentId!: number;

  @IsNumber()
  @IsNotEmpty()
  roomId!: number;

  @IsEnum(PackageLocation)
  @IsNotEmpty()
  location!: PackageLocation;

  @IsOptional()
  @IsString()
  notes?: string | null;

  @IsOptional()
  @IsString()
  photoUrl?: string | null;

  @IsNumber()
  @IsNotEmpty()
  createdBy!: number;
}
