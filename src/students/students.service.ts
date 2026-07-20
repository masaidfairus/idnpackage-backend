/**
 * Service CRUD untuk Student.
 *
 * Fitur:
 * - create() dan update() me-resolve roomId (number) ke entity Room.
 * - bulkSync(): upsert by NIS, fallback dedup by nama+kamar jika NIS kosong.
 * - archiveStudent(): soft-delete (isActive=false) untuk santri yang lulus.
 * - resetAll(): hapus semua santri aktif untuk hard reset tahun ajaran baru.
 */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { CreateBulkStudentDto } from './dto/create-bulk-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { EntityManager, Repository } from 'typeorm';
import { Room } from '../rooms/entities/room.entity';

/** Kelas StudentsService menangani logika bisnis. */
@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly entityManager: EntityManager,

    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  /**
     * Mengeksekusi operasi create.
     * @param createStudentDto Parameter input.
     * @returns Hasil dari operasi create.
     */
    async create(createStudentDto: CreateStudentDto) {
    const { roomId, ...studentData } = createStudentDto;
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
    });

    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} does not exist.`);
    }

    const newStudent = new Student({ ...studentData, roomId: room, isActive: true });
    await this.entityManager.save(newStudent);
    return newStudent;
  }

  /**
   * Bulk Sync (Mixed Strategy):
   * 1. Jika NIS ada & valid → Upsert by NIS (update nama & kamar jika sudah ada).
   * 2. Jika NIS kosong/N/A → Fallback: dedup by nama+kamar.
   * 3. Santri yang diarsipkan dengan NIS yang sama → Re-aktifkan otomatis.
   */
  async bulkSync(createBulkDto: CreateBulkStudentDto) {
    const added: Student[] = [];
    const updated: string[] = [];
    const skipped: string[] = [];
    const roomCache: Record<string, Room> = {};

    // Seed room cache
    const existingRooms = await this.roomRepository.find();
    existingRooms.forEach(room => {
      roomCache[room.name.toLowerCase()] = room;
    });

    for (const studentData of createBulkDto.students) {
      const roomKey = studentData.roomName.toLowerCase();
      const room = roomCache[roomKey];

      if (!room) {
        throw new BadRequestException(
          "Kamar \"" + studentData.roomName + "\" tidak ditemukan di database. Pastikan Anda menggunakan nama kamar yang sudah ada."
        );
      }

      const hasValidNis = studentData.nis && studentData.nis.trim() !== '' && studentData.nis.trim() !== 'N/A';

      if (hasValidNis) {
        // === STRATEGY 1: Upsert by NIS ===
        const existing = await this.studentRepository.findOne({
          where: { nis: studentData.nis },
          relations: { roomId: true },
        });

        if (existing) {
          // Update nama, kamar, dan re-aktifkan jika sempat diarsipkan
          existing.name = studentData.name;
          existing.roomId = room;
          existing.isActive = true;
          await this.entityManager.save(existing);
          updated.push(studentData.name);
        } else {
          const newStudent = new Student({
            name: studentData.name,
            nis: studentData.nis,
            roomId: room,
            isActive: true,
          });
          await this.entityManager.save(newStudent);
          added.push(newStudent);
        }
      } else {
        // === STRATEGY 2: Fallback dedup by nama+kamar ===
        const existing = await this.studentRepository.findOne({
          where: {
            name: studentData.name,
            roomId: { id: room.id },
          },
          relations: { roomId: true },
        });

        if (existing) {
          skipped.push(studentData.name);
        } else {
          const newStudent = new Student({
            name: studentData.name,
            nis: studentData.nis || undefined,
            roomId: room,
            isActive: true,
          });
          await this.entityManager.save(newStudent);
          added.push(newStudent);
        }
      }
    }

    return {
      added: added.length,
      updated: updated.length,
      skipped: skipped.length,
      details: { added: added.map(s => s.name), updated, skipped },
    };
  }

  /** Arsipkan santri yang lulus (soft delete) */
  async archiveStudent(id: number) {
    const student = await this.studentRepository.findOneBy({ id });
    if (!student) throw new NotFoundException(`Student with ID ${id} not found`);
    student.isActive = false;
    return this.entityManager.save(student);
  }

  /** Hard reset: Hapus bersih semua paket dan semua santri (untuk awal tahun ajaran baru) */
  async resetAllActive() {
    // Hapus semua data paket agar foreign key tidak error
    await this.entityManager.query('DELETE FROM package');
    
    // Hapus bersih semua santri dengan raw query untuk menghindari TypeORM "empty criteria" error
    const result = await this.entityManager.query('DELETE FROM student');
    // result dari DELETE query di mysql driver array berisi info affectedRows
    return { deleted: result?.affectedRows ?? 'all' };
  }

  /**
     * Mengeksekusi operasi findAll.
     * @returns Hasil dari operasi findAll.
     */
    async findAll() {
    return this.studentRepository.find({
      where: { isActive: true },
      relations: { roomId: true },
    });
  }

  /**
     * Mengeksekusi operasi findAllArchived.
     * @returns Hasil dari operasi findAllArchived.
     */
    async findAllArchived() {
    return this.studentRepository.find({
      where: { isActive: false },
      relations: { roomId: true },
    });
  }

  /**
     * Mengeksekusi operasi findOne.
     * @param id Parameter input.
     * @returns Hasil dari operasi findOne.
     */
    async findOne(id: number) {
    return this.studentRepository.findOneBy({ id });
  }

  /**
     * Mengeksekusi operasi update.
     * @param id Parameter input.
     * @param updateStudentDto Parameter input.
     * @returns Hasil dari operasi update.
     */
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

  /**
     * Mengeksekusi operasi remove.
     * @param id Parameter input.
     * @returns Hasil dari operasi remove.
     */
    async remove(id: number) {
    return this.studentRepository.delete(id);
  }
}
