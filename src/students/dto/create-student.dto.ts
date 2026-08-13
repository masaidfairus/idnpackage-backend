import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

/** Kelas CreateStudentDto. */
export class CreateStudentDto {
  /** Properti name dengan tipe string. */
  @IsString()
  @IsNotEmpty()
  name!: string;

  /** Properti nis dengan tipe string, opsional. */
  @IsOptional()
  @IsString()
  nis?: string;

  /** Properti roomId dengan tipe number. */
  @IsNumber()
  @IsNotEmpty()
  roomId!: number;
}
