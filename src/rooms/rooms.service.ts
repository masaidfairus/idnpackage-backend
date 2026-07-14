/**
 * Service CRUD untuk Room.
 *
 * Catatan:
 * - findAll() dan findOne() me-load relasi students.
 * - update() menggunakan entityManager.save agar relasi ikut tersimpan.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createRoomDto: CreateRoomDto) {
    const room = new Room(createRoomDto);
    await this.entityManager.save(room);
    return room;
  }

  async findAll() {
    return this.roomRepository.find({ relations: { students: true } });
  }

  async findOne(id: number) {
    return this.roomRepository.findOne({
      where: { id },
      relations: { students: true },
    });
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    const room = await this.roomRepository.findOneBy({ id });

    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    Object.assign(room, updateRoomDto);
    return this.entityManager.save(room);
  }

  async remove(id: number) {
    return this.roomRepository.delete(id);
  }
}
