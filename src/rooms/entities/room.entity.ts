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

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name: string;

  @Column()
  floor: number;

  @OneToMany(() => Student, (student) => student.roomId)
  students: Student[];

  @OneToMany(() => Package, (studentPackage) => studentPackage.roomId)
  packages: Package[];

  @CreateDateColumn()
  createdAt: Date;

  constructor(room: Partial<Room>) {
    Object.assign(this, room);
  }
}
