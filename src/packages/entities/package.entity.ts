/**
 * Entity Package (paket/parcel siswa).
 *
 * Relasi:
 * - studentId -> Student (siswa penerima)
 * - roomId    -> Room (kamarnya)
 * - createdBy -> User (operator/admin yang mencatat)
 *
 * Lifecycle location:
 *   security_post -> dormitory_office -> taken
 *
 * receivedDate di-set manual saat create.
 * pickedUpDate di-set manual saat location = 'taken'.
 */
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Room } from '../../rooms/entities/room.entity';
import { Student } from '../../students/entities/student.entity';
import { PackageLocation } from '../enum/package.enum';

/** Kelas Package adalah entitas database. */
@Entity()
export class Package {
  /** Properti id dengan tipe number. */
    @PrimaryGeneratedColumn()
  id!: number;

  /** Properti studentId dengan tipe import("E:/Main/Code/idnpackage-backend/src/students/entities/student.entity").Student. */
    @ManyToOne(() => Student, (student) => student.packages)
  @JoinColumn({ name: 'studentId' })
  studentId: Student;

  /** Properti roomId dengan tipe import("E:/Main/Code/idnpackage-backend/src/rooms/entities/room.entity").Room. */
    @ManyToOne(() => Room, (room) => room.packages)
  @JoinColumn({ name: 'roomId' })
  roomId: Room;

  /** Properti receivedDate dengan tipe Date. */
    @Column({ type: 'date' })
  receivedDate: Date;

  /** Properti location dengan tipe import("E:/Main/Code/idnpackage-backend/src/packages/enum/package.enum").PackageLocation. */
    @Column({
    type: 'enum',
    enum: PackageLocation,
    default: PackageLocation.SECURITY,
  })
  location: PackageLocation;

  /** Properti pickedUpDate dengan tipe Date | null. */
    @Column({ type: 'date', nullable: true })
  pickedUpDate: Date | null;

  /**
   * Menyimpan lokasi sebelum santri mengambil paket (dijadikan 'taken').
   * Digunakan untuk fitur "Batalkan Diterima" agar paket kembali ke lokasi semula.
   */
  @Column({ type: 'varchar', nullable: true })
  previousLocation: string | null;

  /** Properti notes dengan tipe string | null. */
    @Column({ type: 'text', nullable: true })
  notes: string | null;

  /** Properti photoUrl dengan tipe string | null. */
    @Column({ type: 'longtext', nullable: true })
  photoUrl: string | null;

  /** Properti createdBy dengan tipe import("E:/Main/Code/idnpackage-backend/src/auth/entities/user.entity").User. */
    @ManyToOne(() => User, (user) => user.packages)
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  /** Properti createdAt dengan tipe Date. */
    @CreateDateColumn()
  createdAt: Date;

  /** Properti updatedAt dengan tipe Date. */
    @UpdateDateColumn()
  updatedAt: Date;

  constructor(studentPackage: Partial<Package>) {
    Object.assign(this, studentPackage);
  }
}
