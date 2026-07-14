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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly entityManager: EntityManager,
  ) {}

  async findUserByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );

    createUserDto.password = hashedPassword;
    const user = new User(createUserDto);
    await this.entityManager.save(user);
    return user;
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.password) {
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(
        updateUserDto.password,
        saltOrRounds,
      );
      updateUserDto.password = hashedPassword;
    }

    Object.assign(user, updateUserDto);
    return this.entityManager.save(user);
  }

  async remove(id: number) {
    return this.usersRepository.delete(id);
  }

  async incrementTokenVersion(id: number) {
    await this.usersRepository.increment({ id }, 'tokenVersion', 1);
  }
}
