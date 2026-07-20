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

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  nis: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Room, (room) => room.students)
  @JoinColumn({ name: 'roomId' })
  roomId: Room;

  @OneToMany(() => Package, (studentPackage) => studentPackage.studentId)
  packages: Package[];

  @CreateDateColumn()
  createdAt: Date;

  constructor(student: Partial<Student>) {
    Object.assign(this, student);
  }
}
