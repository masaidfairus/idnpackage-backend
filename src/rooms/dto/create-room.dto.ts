import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

/** Kelas CreateRoomDto. */
export class CreateRoomDto {
  /** Properti name dengan tipe string. */
    @IsString()
  @IsNotEmpty()
  name!: string;

  /** Properti floor dengan tipe number. */
    @IsNumber()
  @IsNotEmpty()
  floor!: number;
}
