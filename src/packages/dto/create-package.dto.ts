import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
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

  @IsString()
  notes?: string | null;

  @IsString()
  photoUrl?: string | null;

  @IsNumber()
  @IsNotEmpty()
  createdBy!: number;
}
