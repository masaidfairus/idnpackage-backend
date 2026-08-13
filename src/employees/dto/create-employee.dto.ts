import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/** Kelas CreateEmployeeDto. */
export class CreateEmployeeDto {
  /** Properti name dengan tipe string. */
  @IsString()
  @IsNotEmpty()
  name!: string;

  /** Properti division dengan tipe string. */
  @IsString()
  @IsNotEmpty()
  division!: string;

  /** Properti position dengan tipe string, opsional. */
  @IsOptional()
  @IsString()
  position?: string;
}
