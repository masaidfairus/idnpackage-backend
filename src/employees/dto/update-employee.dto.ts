import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDto } from './create-employee.dto';

/** Kelas UpdateEmployeeDto. */
export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}
