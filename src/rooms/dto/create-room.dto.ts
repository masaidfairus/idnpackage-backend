import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @IsNotEmpty()
  floor!: number;
}
