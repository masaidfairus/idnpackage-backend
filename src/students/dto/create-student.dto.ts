import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  nis!: string;

  @IsNumber()
  @IsNotEmpty()
  roomId!: number;
}
