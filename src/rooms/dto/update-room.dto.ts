import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomDto } from './create-room.dto';

/** Kelas UpdateRoomDto. */
export class UpdateRoomDto extends PartialType(CreateRoomDto) {}
