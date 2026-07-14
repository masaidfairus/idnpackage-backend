/**
 * Service CRUD untuk Student.
 *
 * Catatan:
 * - create() dan update() me-resolve roomId (number) ke entity Room.
 * - update() hanya me-resolve roomId jika field tersebut dikirim.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { EntityManager, Repository } from 'typeorm';
import { Room } from '../rooms/entities/room.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly entityManager: EntityManager,

    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    const { roomId, ...studentData } = createStudentDto;
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
    });

    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} does not exist.`);
    }

    const newStudent = new Student({ ...studentData, roomId: room });
    await this.entityManager.save(newStudent);
    return newStudent;
  }

  async findAll() {
    return this.studentRepository.find();
  }

  async findOne(id: number) {
    return this.studentRepository.findOneBy({ id });
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    const student = await this.studentRepository.findOneBy({ id });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    const { roomId, ...studentData } = updateStudentDto;

    if (roomId) {
      const room = await this.roomRepository.findOne({ where: { id: roomId } });
      if (!room) {
        throw new NotFoundException(`Room with ID ${roomId} does not exist.`);
      }
      Object.assign(student, { ...studentData, roomId: room });
    } else {
      Object.assign(student, studentData);
    }

    return this.entityManager.save(student);
  }

  async remove(id: number) {
    return this.studentRepository.delete(id);
  }
}
