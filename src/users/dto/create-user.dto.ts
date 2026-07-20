import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';
import { Role } from '../../auth/enum/role.enum';

/** Kelas CreateUserDto. */
export class CreateUserDto {
  /** Properti name dengan tipe string. */
    @IsString()
  @IsNotEmpty()
  name!: string;

  /** Properti email dengan tipe string. */
    @IsEmail()
  @IsNotEmpty()
  email!: string;

  /** Properti password dengan tipe string. */
    @IsString()
  @IsNotEmpty()
  password!: string;

  /** Properti role dengan tipe import("E:/Main/Code/idnpackage-backend/src/auth/enum/role.enum").Role | undefined. */
    @IsEnum(Role)
  role?: Role;

  /** Properti roomId dengan tipe number | null | undefined. */
    @IsOptional()
  @IsNumber()
  roomId?: number | null;
}
