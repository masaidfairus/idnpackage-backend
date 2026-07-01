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

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'text', nullable: true })
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
