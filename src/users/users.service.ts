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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    private readonly entityManager: EntityManager,
  ) {}

  async findUserByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
      relations: { room: true },
    });
  }

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

  async findAll() {
    return this.usersRepository.find({ relations: { room: true } });
  }

  async findOne(id: number) {
    return this.usersRepository.findOne({
      where: { id },
      relations: { room: true },
    });
  }

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

  async remove(id: number) {
    return this.usersRepository.delete(id);
  }

  async incrementTokenVersion(id: number) {
    await this.usersRepository.increment({ id }, 'tokenVersion', 1);
  }
}
