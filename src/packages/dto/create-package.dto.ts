import { IsEnum, IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { PackageLocation } from '../enum/package.enum';

/** Kelas CreatePackageDto. */
export class CreatePackageDto {
  /** Properti studentId dengan tipe number. */
    @IsNumber()
  @IsNotEmpty()
  studentId!: number;

  /** Properti roomId dengan tipe number. */
    @IsNumber()
  @IsNotEmpty()
  roomId!: number;

  /** Properti location dengan tipe import("E:/Main/Code/idnpackage-backend/src/packages/enum/package.enum").PackageLocation. */
    @IsEnum(PackageLocation)
  @IsNotEmpty()
  location!: PackageLocation;

  /** Properti notes dengan tipe string | null | undefined. */
    @IsOptional()
  @IsString()
  notes?: string | null;

  /** Properti photoUrl dengan tipe string | null | undefined. */
    @IsOptional()
  @IsString()
  photoUrl?: string | null;

  /** Properti createdBy dengan tipe number. */
    @IsNumber()
  @IsNotEmpty()
  createdBy!: number;
}
