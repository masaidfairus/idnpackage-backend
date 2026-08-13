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
import { CreateBulkEmployeeDto } from './dto/create-bulk-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Package } from '../packages/entities/package.entity';
import { EntityManager, Repository } from 'typeorm';

/** Kelas EmployeesService menangani logika bisnis. */
@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
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
   * Bulk Sync untuk Staff/Guru
   */
  async bulkSync(createBulkDto: CreateBulkEmployeeDto) {
    const added: Employee[] = [];
    const updated: string[] = [];
    const skipped: string[] = [];

    for (const empData of createBulkDto.employees) {
      const existing = await this.employeeRepository.findOne({
        where: { name: empData.name },
      });

      if (existing) {
        if (
          existing.division !== empData.division ||
          existing.position !== empData.position
        ) {
          existing.division = empData.division;
          if (empData.position !== undefined) {
            existing.position = empData.position;
          }
          await this.entityManager.save(existing);
          updated.push(existing.name);
        } else {
          skipped.push(existing.name);
        }
      } else {
        const newEmployee = new Employee({
          name: empData.name,
          division: empData.division,
          position: empData.position,
        });
        await this.entityManager.save(newEmployee);
        added.push(newEmployee);
      }
    }

    return {
      added: added.length,
      updated: updated.length,
      skipped: skipped.length,
      details: { added: added.map((e) => e.name), updated, skipped },
    };
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

    // Lepas FK package.employeeId sebelum menghapus employee. Tanpa ini,
    // menghapus employee yang masih memiliki paket akan gagal dengan MySQL
    // foreign key constraint error (1451). Konsisten dengan RoomsService
    // yang me-null-kan FK terlebih dahulu sebelum delete.
    await this.packageRepository
      .createQueryBuilder()
      .update()
      .set({ employeeId: null as any })
      .where('employeeId = :id', { id })
      .execute();

    return this.employeeRepository.delete(id);
  }
}
