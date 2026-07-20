import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/** Kelas BulkStudentItemDto. */
export class BulkStudentItemDto {
  /** Properti name dengan tipe string. */
    @IsString()
  @IsNotEmpty()
  name!: string;

  /** Properti nis dengan tipe string | undefined. */
    @IsString()
  @IsOptional()
  nis?: string;

  /** Properti roomName dengan tipe string. */
    @IsString()
  @IsNotEmpty()
  roomName!: string;
}

/** Kelas CreateBulkStudentDto. */
export class CreateBulkStudentDto {
  /** Properti students dengan tipe import("E:/Main/Code/idnpackage-backend/src/students/dto/create-bulk-student.dto").BulkStudentItemDto[]. */
    @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkStudentItemDto)
  students!: BulkStudentItemDto[];
}
