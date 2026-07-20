import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class BulkStudentItemDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  nis?: string;

  @IsString()
  @IsNotEmpty()
  roomName!: string;
}

export class CreateBulkStudentDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkStudentItemDto)
  students!: BulkStudentItemDto[];
}
