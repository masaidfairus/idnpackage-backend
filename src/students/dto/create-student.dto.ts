import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

/** Kelas CreateStudentDto. */
export class CreateStudentDto {
  /** Properti name dengan tipe string. */
    @IsString()
  @IsNotEmpty()
  name!: string;

  /** Properti nis dengan tipe string. */
    @IsString()
  @IsNotEmpty()
  nis!: string;

  /** Properti roomId dengan tipe number. */
    @IsNumber()
  @IsNotEmpty()
  roomId!: number;
}
