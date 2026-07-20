/**
 * Service untuk CRUD User.
 *
 * Semua password di-hash dengan bcrypt (saltRounds = 10) sebelum disimpan.
 * findUserByEmail() dipakai oleh AuthService untuk login.
 * incrementTokenVersion() dipakai untuk logout invalidation.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityManager, Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../auth/entities/user.entity';
import { Room } from '../rooms/entities/room.entity';

/** Kelas UsersService menangani logika bisnis. */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    private readonly entityManager: EntityManager,
  ) {}

  /**
     * Mengeksekusi operasi findUserByEmail.
     * @param email Parameter input.
     * @returns Hasil dari operasi findUserByEmail.
     */
    async findUserByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
      relations: { room: true },
    });
  }

  /**
     * Mengeksekusi operasi create.
     * @param createUserDto Parameter input.
     * @returns Hasil dari operasi create.
     */
    async create(createUserDto: CreateUserDto) {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );

    const { roomId, ...rest } = createUserDto;
    rest.password = hashedPassword;
    
    const user = new User(rest);
    if (roomId) {
      const room = await this.roomRepository.findOneBy({ id: roomId });
      if (room) user.room = room;
    }

    await this.entityManager.save(user);
    return user;
  }

  /**
     * Mengeksekusi operasi findAll.
     * @returns Hasil dari operasi findAll.
     */
    async findAll() {
    return this.usersRepository.find({ relations: { room: true } });
  }

  /**
     * Mengeksekusi operasi findOne.
     * @param id Parameter input.
     * @returns Hasil dari operasi findOne.
     */
    async findOne(id: number) {
    return this.usersRepository.findOne({
      where: { id },
      relations: { room: true },
    });
  }

  /**
     * Mengeksekusi operasi update.
     * @param id Parameter input.
     * @param updateUserDto Parameter input.
     * @returns Hasil dari operasi update.
     */
    async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { roomId, ...rest } = updateUserDto;

    if (rest.password) {
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(
        rest.password,
        saltOrRounds,
      );
      rest.password = hashedPassword;
    }

    Object.assign(user, rest);
    
    if (roomId !== undefined) {
      if (roomId === null) {
        user.room = null;
      } else {
        const room = await this.roomRepository.findOneBy({ id: roomId });
        if (room) user.room = room;
      }
    }

    return this.entityManager.save(user);
  }

  /**
     * Mengeksekusi operasi remove.
     * @param id Parameter input.
     * @returns Hasil dari operasi remove.
     */
    async remove(id: number) {
    return this.usersRepository.delete(id);
  }

  /**
     * Mengeksekusi operasi incrementTokenVersion.
     * @param id Parameter input.
     * @returns Hasil dari operasi incrementTokenVersion.
     */
    async incrementTokenVersion(id: number) {
    await this.usersRepository.increment({ id }, 'tokenVersion', 1);
  }
}
