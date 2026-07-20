/**
 * Service CRUD untuk Room.
 *
 * Catatan:
 * - findAll() dan findOne() me-load relasi students.
 * - update() menggunakan entityManager.save agar relasi ikut tersimpan.
 * - remove() terlebih dahulu menghapus relasi FK sebelum menghapus room.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Student } from '../students/entities/student.entity';
import { Package } from '../packages/entities/package.entity';
import { EntityManager, Repository } from 'typeorm';

/** Kelas RoomsService menangani logika bisnis. */
@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
    private readonly entityManager: EntityManager,
  ) {}

  /**
     * Mengeksekusi operasi create.
     * @param createRoomDto Parameter input.
     * @returns Hasil dari operasi create.
     */
    async create(createRoomDto: CreateRoomDto) {
    const room = new Room(createRoomDto);
    await this.entityManager.save(room);
    return room;
  }

  /**
     * Mengeksekusi operasi findAll.
     * @returns Hasil dari operasi findAll.
     */
    async findAll() {
    return this.roomRepository.find({ relations: { students: true } });
  }

  /**
     * Mengeksekusi operasi findOne.
     * @param id Parameter input.
     * @returns Hasil dari operasi findOne.
     */
    async findOne(id: number) {
    return this.roomRepository.findOne({
      where: { id },
      relations: { students: true },
    });
  }

  /**
     * Mengeksekusi operasi update.
     * @param id Parameter input.
     * @param updateRoomDto Parameter input.
     * @returns Hasil dari operasi update.
     */
    async update(id: number, updateRoomDto: UpdateRoomDto) {
    const room = await this.roomRepository.findOneBy({ id });

    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    Object.assign(room, updateRoomDto);
    return this.entityManager.save(room);
  }

  /**
     * Mengeksekusi operasi remove.
     * @param id Parameter input.
     * @returns Hasil dari operasi remove.
     */
    async remove(id: number) {
    const room = await this.roomRepository.findOneBy({ id });
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    // Lepas semua FK dari student sebelum hapus kamar
    await this.studentRepository
      .createQueryBuilder()
      .update()
      .set({ roomId: null as any })
      .where('roomId = :id', { id })
      .execute();

    // Lepas semua FK dari package sebelum hapus kamar
    await this.packageRepository
      .createQueryBuilder()
      .update()
      .set({ roomId: null as any })
      .where('roomId = :id', { id })
      .execute();

    return this.roomRepository.delete(id);
  }
}
