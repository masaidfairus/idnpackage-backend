/**
 * Service CRUD untuk Employee (karyawan/pegawai).
 *
 * Fitur:
 * - create(): membuat employee baru.
 * - findAll()/findOne(): membaca employee.
 * - update(): memperbarui employee.
 * - remove(): menghapus employee.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { EntityManager, Repository } from 'typeorm';

/** Kelas EmployeesService menangani logika bisnis. */
@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly entityManager: EntityManager,
  ) {}

  /**
   * Mengeksekusi operasi create.
   * @param createEmployeeDto Parameter input.
   * @returns Hasil dari operasi create.
   */
  async create(createEmployeeDto: CreateEmployeeDto) {
    const employee = new Employee(createEmployeeDto);
    await this.entityManager.save(employee);
    return employee;
  }

  /**
   * Mengeksekusi operasi findAll.
   * @returns Hasil dari operasi findAll.
   */
  async findAll() {
    return this.employeeRepository.find();
  }

  /**
   * Mengeksekusi operasi findOne.
   * @param id Parameter input.
   * @returns Hasil dari operasi findOne.
   */
  async findOne(id: number) {
    return this.employeeRepository.findOne({
      where: { id },
    });
  }

  /**
   * Mengeksekusi operasi update.
   * @param id Parameter input.
   * @param updateEmployeeDto Parameter input.
   * @returns Hasil dari operasi update.
   */
  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.employeeRepository.findOneBy({ id });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    Object.assign(employee, updateEmployeeDto);
    return this.entityManager.save(employee);
  }

  /**
   * Mengeksekusi operasi remove.
   * @param id Parameter input.
   * @returns Hasil dari operasi remove.
   */
  async remove(id: number) {
    const employee = await this.employeeRepository.findOneBy({ id });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return this.employeeRepository.delete(id);
  }
}
