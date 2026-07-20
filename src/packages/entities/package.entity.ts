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

@Entity()
export class Package {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Student, (student) => student.packages)
  @JoinColumn({ name: 'studentId' })
  studentId: Student;

  @ManyToOne(() => Room, (room) => room.packages)
  @JoinColumn({ name: 'roomId' })
  roomId: Room;

  @Column({ type: 'date' })
  receivedDate: Date;

  @Column({
    type: 'enum',
    enum: PackageLocation,
    default: PackageLocation.SECURITY,
  })
  location: PackageLocation;

  @Column({ type: 'date', nullable: true })
  pickedUpDate: Date | null;

  /**
   * Menyimpan lokasi sebelum santri mengambil paket (dijadikan 'taken').
   * Digunakan untuk fitur "Batalkan Diterima" agar paket kembali ke lokasi semula.
   */
  @Column({ type: 'varchar', nullable: true })
  previousLocation: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'longtext', nullable: true })
  photoUrl: string | null;

  @ManyToOne(() => User, (user) => user.packages)
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(studentPackage: Partial<Package>) {
    Object.assign(this, studentPackage);
  }
}
