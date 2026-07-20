/**
 * Entity Student (siswa).
 *
 * Relasi:
 * - roomId -> Room (kamar siswa)
 * - packages: satu siswa bisa punya banyak paket
 *
 * NIS bersifat unique (jika bukan 'N/A').
 * isActive: false = santri sudah lulus/diarsipkan (soft delete).
 */
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from '../../rooms/entities/room.entity';
import { Package } from '../../packages/entities/package.entity';

/** Kelas Student adalah entitas database. */
@Entity()
export class Student {
  /** Properti id dengan tipe number. */
    @PrimaryGeneratedColumn()
  id!: number;

  /** Properti name dengan tipe string. */
    @Column()
  name: string;

  /** Properti nis dengan tipe string. */
    @Column({ nullable: true })
  nis: string;

  /** Properti isActive dengan tipe boolean. */
    @Column({ default: true })
  isActive: boolean;

  /** Properti roomId dengan tipe import("E:/Main/Code/idnpackage-backend/src/rooms/entities/room.entity").Room. */
    @ManyToOne(() => Room, (room) => room.students)
  @JoinColumn({ name: 'roomId' })
  roomId: Room;

  /** Properti packages dengan tipe import("E:/Main/Code/idnpackage-backend/src/packages/entities/package.entity").Package[]. */
    @OneToMany(() => Package, (studentPackage) => studentPackage.studentId)
  packages: Package[];

  /** Properti createdAt dengan tipe Date. */
    @CreateDateColumn()
  createdAt: Date;

  constructor(student: Partial<Student>) {
    Object.assign(this, student);
  }
}
