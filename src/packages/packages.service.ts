import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Package } from './entities/package.entity';
import { Student } from '../students/entities/student.entity';
import { Room } from '../rooms/entities/room.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
    private readonly entityManager: EntityManager,

    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,

    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createPackageDto: CreatePackageDto) {
    const { studentId, roomId, createdBy, ...packageData } = createPackageDto;
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });

    const room = await this.roomRepository.findOne({
      where: { id: roomId },
    });

    const operator = await this.userRepository.findOne({
      where: { id: createdBy },
    });

    if (!student || !room || !operator) {
      throw new NotFoundException(`Student, Room, Operator ID does not exist.`);
    }

    const newPackage = new Package({
      studentId: student,
      roomId: room,
      receivedDate: new Date(),
      createdBy: operator,
      ...packageData,
    });

    await this.entityManager.save(newPackage);
    return newPackage;
  }

async findAll() {
    return this.packageRepository.find({
      relations: {
        studentId: true, // Mengambil data Student yang berelasi
        roomId: true,    // Mengambil data Room yang berelasi
        createdBy: true, // (Opsional) Mengambil data User/Operator
      },
    });
  }

  async findOne(id: number) {
    return this.packageRepository.findOne({
      where: { id },
      relations: {
        studentId: true,
        roomId: true,
        createdBy: true,
      },
    });
  }

  async update(id: number, updatePackageDto: UpdatePackageDto) {
    const studentPackage = await this.packageRepository.findOneBy({ id });

    if (!studentPackage) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }

    Object.assign(studentPackage, updatePackageDto);
    return this.entityManager.save(studentPackage);
  }

  async remove(id: number) {
    return this.packageRepository.delete(id);
  }
}
