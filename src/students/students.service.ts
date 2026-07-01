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

    Object.assign(student, updateStudentDto);
    return this.entityManager.save(student);
  }

  async remove(id: number) {
    return this.studentRepository.delete(id);
  }
}
