/**
 * Service untuk CRUD Package.
 *
 * Catatan:
 * - create() menerima studentId, roomId, createdBy (number) lalu me-resolve
 *   ke entity Student, Room, User sebelum menyimpan.
 * - update() juga me-resolve relasi agar foreign key tetap konsisten.
 * - findAll() dan findOne() me-load relasi studentId, roomId, createdBy.
 * - receivedDate auto-set ke tanggal saat create.
 */
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
      throw new NotFoundException(`Student, Room, or Operator ID does not exist.`);
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
        studentId: true,
        roomId: true,
        createdBy: true,
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
    const studentPackage = await this.packageRepository.findOne({
      where: { id },
      relations: { studentId: true, roomId: true, createdBy: true },
    });

    if (!studentPackage) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }

    const { studentId, roomId, createdBy, ...packageData } = updatePackageDto;

    Object.assign(studentPackage, packageData);

    if (studentId) {
      const student = await this.studentRepository.findOne({
        where: { id: studentId },
      });
      if (!student) {
        throw new NotFoundException(
          `Student with ID ${studentId} does not exist.`,
        );
      }
      studentPackage.studentId = student;
    }

    if (roomId) {
      const room = await this.roomRepository.findOne({ where: { id: roomId } });
      if (!room) {
        throw new NotFoundException(`Room with ID ${roomId} does not exist.`);
      }
      studentPackage.roomId = room;
    }

    if (createdBy) {
      const operator = await this.userRepository.findOne({
        where: { id: createdBy },
      });
      if (!operator) {
        throw new NotFoundException(
          `User with ID ${createdBy} does not exist.`,
        );
      }
      studentPackage.createdBy = operator;
    }

    return this.entityManager.save(studentPackage);
  }

  async remove(id: number) {
    return this.packageRepository.delete(id);
  }
}
