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
import { PackageLocation } from './enum/package.enum';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Package } from './entities/package.entity';
import { Student } from '../students/entities/student.entity';
import { Room } from '../rooms/entities/room.entity';
import { User } from '../auth/entities/user.entity';
import { Employee } from '../employees/entities/employee.entity';

/** Kelas PackagesService menangani logika bisnis. */
@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
    private readonly entityManager: EntityManager,

    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,

    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,

    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Mengeksekusi operasi create.
   * @param createPackageDto Parameter input.
   * @returns Hasil dari operasi create.
   */
  async create(createPackageDto: CreatePackageDto) {
    const { employeeId, studentId, roomId, createdBy, manualName, ...packageData } =
      createPackageDto;

    const operator = await this.userRepository.findOne({
      where: { id: createdBy },
    });

    if (!operator) {
      throw new NotFoundException(`Operator ID does not exist.`);
    }

    if (employeeId) {
      const employee = await this.employeeRepository.findOne({
        where: { id: employeeId },
      });

      // Fail-fast: jika employeeId dikirim tapi employee tidak ditemukan,
      // langsung tolak request. Sebelumnya kode ini fall-through ke branch
      // student, sehingga request dengan employeeId yang salah (typo) +
      // studentId valid akan diam-diam membuat paket SISWA padahal client
      // mengira membuat paket KARYAWAN. Menolak lebih aman daripada
      // menyimpan data yang salah ke database.
      if (!employee) {
        throw new NotFoundException(
          `Employee with ID ${employeeId} does not exist.`,
        );
      }

      const newPackage = new Package({
        employeeId: employee,
        receivedDate: new Date(),
        createdBy: operator,
        ...packageData,
      });

      await this.entityManager.save(newPackage);
      return newPackage;
    }

    if (studentId && roomId) {
      const student = await this.studentRepository.findOne({
        where: { id: studentId },
      });

      const room = await this.roomRepository.findOne({
        where: { id: roomId },
      });

      if (student && room) {
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
    }

    if (manualName) {
      const newPackage = new Package({
        manualName,
        receivedDate: new Date(),
        createdBy: operator,
        ...packageData,
      });
      await this.entityManager.save(newPackage);
      return newPackage;
    }

    throw new NotFoundException(`Employee & Student does not exist.`);
  }

  /**
   * Mengeksekusi operasi findAll.
   * @returns Hasil dari operasi findAll.
   */
  async findAll() {
    return this.packageRepository.find({
      relations: {
        studentId: true,
        employeeId: true,
        roomId: true,
        createdBy: true,
      },
    });
  }

  /**
   * Mengeksekusi operasi findOne.
   * @param id Parameter input.
   * @returns Hasil dari operasi findOne.
   */
  async findOne(id: number) {
    return this.packageRepository.findOne({
      where: { id },
      relations: {
        studentId: true,
        employeeId: true,
        roomId: true,
        createdBy: true,
      },
    });
  }

  /**
   * Mengeksekusi operasi update.
   * @param id Parameter input.
   * @param updatePackageDto Parameter input.
   * @returns Hasil dari operasi update.
   */
  async update(id: number, updatePackageDto: UpdatePackageDto) {
    const userPackage = await this.packageRepository.findOne({
      where: { id },
      relations: {
        employeeId: true,
        studentId: true,
        roomId: true,
        createdBy: true,
      },
    });

    if (!userPackage) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }

    const { employeeId, studentId, roomId, createdBy, manualName, ...packageData } =
      updatePackageDto;

    Object.assign(userPackage, packageData);
    if (manualName !== undefined) {
      userPackage.manualName = manualName;
    }

    if (employeeId) {
      const employee = await this.employeeRepository.findOne({
        where: { id: employeeId },
      });
      // Perbaikan copy-paste: pesan error sebelumnya menyalin dari branch
      // student ("Student with ID ${studentId}"), padahal di sini yang
      // divalidasi adalah employeeId, sehingga pesan yang keluar menjadi
      // "Student with ID undefined does not exist." — menyesatkan client.
      // Sekarang pesan menyebutkan employeeId yang sebenarnya diverifikasi.
      if (!employee) {
        throw new NotFoundException(
          `Employee with ID ${employeeId} does not exist.`,
        );
      }
      userPackage.employeeId = employee;
    }

    if (studentId) {
      const student = await this.studentRepository.findOne({
        where: { id: studentId },
      });
      if (!student) {
        throw new NotFoundException(
          `Student with ID ${studentId} does not exist.`,
        );
      }
      userPackage.studentId = student;
    }

    if (roomId) {
      const room = await this.roomRepository.findOne({ where: { id: roomId } });
      if (!room) {
        throw new NotFoundException(`Room with ID ${roomId} does not exist.`);
      }
      userPackage.roomId = room;
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
      userPackage.createdBy = operator;
    }

    return this.entityManager.save(userPackage);
  }

  /**
   * Toggle status paket antara 'taken' dan lokasi sebelumnya.
   * Digunakan oleh Teacher: ketika santri mengambil paket bersama teacher,
   * teacher bisa menandai sebagai diterima, atau membatalkannya.
   */
  async toggleTaken(id: number) {
    const studentPackage = await this.packageRepository.findOne({
      where: { id },
      relations: { studentId: true, roomId: true, createdBy: true },
    });

    if (!studentPackage) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }

    if (studentPackage.location === PackageLocation.TAKEN) {
      // Batalkan: kembalikan ke lokasi sebelumnya (atau security_post jika tidak ada)
      studentPackage.location =
        (studentPackage.previousLocation as PackageLocation) ||
        PackageLocation.SECURITY;
      studentPackage.previousLocation = null;
      studentPackage.pickedUpDate = null;
    } else {
      // Tandai sebagai diterima: simpan lokasi saat ini dulu
      studentPackage.previousLocation = studentPackage.location;
      studentPackage.location = PackageLocation.TAKEN;
      studentPackage.pickedUpDate = new Date();
    }

    return this.entityManager.save(studentPackage);
  }

  /**
   * Mengeksekusi operasi remove.
   * @param id Parameter input.
   * @returns Hasil dari operasi remove.
   */
  async remove(id: number) {
    return this.packageRepository.delete(id);
  }
}
