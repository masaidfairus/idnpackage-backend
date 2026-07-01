import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Room } from '../../rooms/entities/room.entity';
import { Package } from '../../packages/entities/package.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name: string;

  @Column({ unique: true })
  nis: string;

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
