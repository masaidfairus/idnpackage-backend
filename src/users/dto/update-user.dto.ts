import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

/** Kelas UpdateUserDto. */
export class UpdateUserDto extends PartialType(CreateUserDto) {}
