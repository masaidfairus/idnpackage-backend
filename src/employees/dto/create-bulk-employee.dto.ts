import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class BulkEmployeeItemDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  division!: string;

  @IsString()
  @IsOptional()
  position?: string;
}

export class CreateBulkEmployeeDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkEmployeeItemDto)
  employees!: BulkEmployeeItemDto[];
}
