import {
  Column,
  CreateDateColumn,
  Entity,
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

  @Column()
  nis: string;

  @ManyToOne(() => Room, (room) => room.students)
  roomId: Room;

  @OneToMany(() => Package, (studentPackage) => studentPackage.studentId)
  packages: Package[];

  @CreateDateColumn()
  createdAt: Date;
}
