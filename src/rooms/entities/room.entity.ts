/**
 * Entity Room (kamar asrama).
 *
 * Relasi:
 * - students: satu kamar bisa punya banyak siswa
 * - packages: satu kamar bisa punya banyak paket
 */
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Package } from '../../packages/entities/package.entity';
import { Student } from '../../students/entities/student.entity';

/** Kelas Room adalah entitas database. */
@Entity()
export class Room {
  /** Properti id dengan tipe number. */
    @PrimaryGeneratedColumn()
  id!: number;

  /** Properti name dengan tipe string. */
    @Column()
  name: string;

  /** Properti floor dengan tipe number. */
    @Column()
  floor: number;

  /** Properti students dengan tipe import("E:/Main/Code/idnpackage-backend/src/students/entities/student.entity").Student[]. */
    @OneToMany(() => Student, (student) => student.roomId)
  students: Student[];

  /** Properti packages dengan tipe import("E:/Main/Code/idnpackage-backend/src/packages/entities/package.entity").Package[]. */
    @OneToMany(() => Package, (studentPackage) => studentPackage.roomId)
  packages: Package[];

  /** Properti createdAt dengan tipe Date. */
    @CreateDateColumn()
  createdAt: Date;

  constructor(room: Partial<Room>) {
    Object.assign(this, room);
  }
}
